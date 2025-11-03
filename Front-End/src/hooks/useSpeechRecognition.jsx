import { useCallback, useRef, useState, useEffect } from 'react';

export const useSpeechRecognition = (options = {}) => {
    const {
        autoStart = false,
        onCommand,
        onStateChange
    } = options;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);

    // Check browser support
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);
        
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;        // Mas mabilis kesa continuous: true
            recognition.interimResults = true;     // Real-time feedback
            recognition.lang = 'en-US';           // Pwede palitan ng 'fil-PH'
            recognition.maxAlternatives = 1;       // Mas kaunting processing
            
            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const clearSilenceTimer = useCallback(() => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    }, []);

    const startListening = useCallback(() => {
        if (!recognitionRef.current || isListening) {
            return;
        }
        const recognition = recognitionRef.current;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            
            // Notify global state
            window.dispatchEvent(new CustomEvent('speech-state-change', {
                detail: { isListening: true, isProcessing: false }
            }));
            
            if (onStateChange) onStateChange(true);
        };

        recognition.onresult = (event) => {
            clearSilenceTimer();
            
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPart;
                } else {
                    interimTranscript += transcriptPart;
                }
            }

            // Display interim results for real-time feedback
            if (interimTranscript) {
                setTranscript(interimTranscript);
            }

            // Process final results immediately
            if (finalTranscript) {
                setTranscript(finalTranscript);
                setLastCommand(finalTranscript);
                
                // ULTRA FAST: Dispatch command immediately
                window.dispatchEvent(
                    new CustomEvent("voice-command", {
                        detail: { 
                            command: finalTranscript,
                            timestamp: Date.now()
                        }
                    })
                );

                // Call custom callback if provided
                if (onCommand) {
                    onCommand(finalTranscript);
                }

                // Auto-restart after short delay for continuous listening
                setTimeout(() => {
                    if (isListening) {
                        try {
                            recognition.start();
                        } catch (error) {
                            console.log("🔄 Auto-restarting recognition");
                        }
                    }
                }, 100);
            }

            // Reset silence timer for long utterances
            silenceTimerRef.current = setTimeout(() => {
                if (interimTranscript && !finalTranscript) {
                    recognition.stop();
                    setTimeout(() => {
                        if (isListening) {
                            recognition.start();
                        }
                    }, 100);
                }
            }, 3000);
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            clearSilenceTimer();
            
            // Notify global state
            window.dispatchEvent(new CustomEvent('speech-state-change', {
                detail: { isListening: false, isProcessing: false, error: event.error }
            }));
            
            if (onStateChange) onStateChange(false);

            // Auto-restart on certain errors
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                setTimeout(() => {
                    if (isListening) {
                        recognition.start();
                    }
                }, 500);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            clearSilenceTimer();
            
            // Notify global state
            window.dispatchEvent(new CustomEvent('speech-state-change', {
                detail: { isListening: false, isProcessing: false }
            }));
            
            if (onStateChange) onStateChange(false);

            // Auto-restart for continuous listening
            setTimeout(() => {
                if (isListening) {
                    try {
                        recognition.start();
                    } catch (error) {
                    setTimeout(() => recognition.start(), 200);
                    }
                }
            }, 100);
        };

        try {
            recognition.start();
        } catch (error) {
            // Retry after short delay
            setTimeout(() => {
                if (isListening) {
                    recognition.start();
                }
            }, 300);
        }
    }, [isListening, clearSilenceTimer, onCommand, onStateChange]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        clearSilenceTimer();
        
        // Notify global state
        window.dispatchEvent(new CustomEvent('speech-state-change', {
            detail: { isListening: false, isProcessing: false }
        }));
        
        if (onStateChange) onStateChange(false);
    }, [isListening, clearSilenceTimer, onStateChange]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Auto-start if enabled
    useEffect(() => {
        if (autoStart && isSupported && !isListening) {
            const timer = setTimeout(() => {
                startListening();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [autoStart, isSupported, isListening, startListening]);

    // Auto-cleanup on unmount
    useEffect(() => {
        return () => {
            clearSilenceTimer();
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    // Ignore errors during cleanup
                }
            }
        };
    }, [clearSilenceTimer]);

    return {
        isListening,
        transcript,
        lastCommand,
        startListening,
        stopListening,
        toggleListening,
        isSupported
    };
};