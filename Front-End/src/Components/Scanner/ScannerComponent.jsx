import React, { useEffect, useState, useRef, useContext } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import logo from "../../../src/assets/logo-login.png";
import LoadingOverlay from "../../ReusableFolder/LoadingOverlay";

export default function ScannerComponent() {
    const { Attendance } = useContext(ParticipantDisplayContext);
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loading, setLoading] = useState(true); // <-- loading state
    const scannerRef = useRef(null);
    const beepSound = useRef(
        new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
    );

    useEffect(() => {
        // Simulate 1 second loading before showing the scanner
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const startScanner = async () => {
        if (isScanning || isTransitioning) return;
        setIsTransitioning(true);

        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("qr-reader");
            }

            await scannerRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    const now = new Date();
                    const dateTimeString = now.toLocaleString();

                    const scanData = {
                        code: decodedText,
                        timestamp: dateTimeString,
                    };

                    setScanResult(scanData);
                    beepSound.current.play().catch(() => {});
                    Attendance(scanData);
                }
            );

            setIsScanning(true);
        } catch (err) {
            console.error("Camera start failed:", err);
        } finally {
            setIsTransitioning(false);
        }
    };

    const stopScanner = async () => {
        if (!isScanning || isTransitioning || !scannerRef.current) return;
        setIsTransitioning(true);

        try {
            await scannerRef.current.stop();
            scannerRef.current.clear();
            scannerRef.current = null;
            setIsScanning(false);
        } catch (err) {
            console.warn("Scanner stop failed:", err);
        } finally {
            setIsTransitioning(false);
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    // Show loading overlay for 1 second
    if (loading) {
        return <LoadingOverlay message="Loading QR Scanner..." />;
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-pink-400 to-blue-500 p-4">
            <img src={logo} alt="LGU Naval EMS Logo" className="mb-4 h-24 w-24" />
            <h1
                className="mb-6 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-center text-2xl font-bold text-transparent"
                style={{
                    WebkitTextStroke: "1px white",
                    WebkitTextFillColor: "transparent",
                }}
            >
                LGU Naval EMS Attendance
            </h1>

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-center text-xl font-bold">QR Code Scanner</h2>

                {/* Scanner container */}
                <div
                    id="qr-reader"
                    className="h-64 w-full rounded-xl border-4 border-dashed border-purple-300"
                />

                <p className="mt-3 text-center text-sm text-gray-600">
                    Point your camera at a QR Code
                </p>

                <div className="mt-4 flex justify-center gap-4">
                    {!isScanning ? (
                        <button
                            onClick={startScanner}
                            disabled={isTransitioning}
                            className={`rounded-lg px-6 py-2 font-semibold ${
                                isTransitioning
                                    ? "cursor-not-allowed bg-gray-400"
                                    : "bg-blue-600 text-white hover:bg-pink-700"
                            }`}
                        >
                            Start Scanner
                        </button>
                    ) : (
                        <button
                            onClick={stopScanner}
                            disabled={isTransitioning}
                            className={`rounded-lg px-6 py-2 font-semibold ${
                                isTransitioning
                                    ? "cursor-not-allowed bg-gray-400"
                                    : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                        >
                            Stop Scanner
                        </button>
                    )}
                </div>

                {/* Display scanned result */}
                {scanResult && (
                    <div className="mt-4 rounded-lg border border-green-300 bg-green-100 px-3 py-2 text-center text-green-800">
                        <p>
                            <strong>Scanned Code:</strong> {scanResult.code}
                        </p>
                        <p>
                            <strong>Time:</strong> {scanResult.timestamp}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
