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
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const scannerRef = useRef(null);
  const beepSound = useRef(
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
  );

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading overlay simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const startScanner = async () => {
    if (isScanning || isTransitioning) return;
    setIsTransitioning(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      // Dynamic QR box size based on screen width
      const width = window.innerWidth;
      let qrboxSize = Math.min(250, width * 0.7); // Responsive size

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: qrboxSize, height: qrboxSize } },
        (decodedText) => {
          const now = new Date();
          const dateTimeString = now.toLocaleString();
          const scanData = { code: decodedText, timestamp: dateTimeString };
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

  if (loading) {
    return <LoadingOverlay message="Loading QR Scanner..." />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-400 to-blue-500 p-4">
      {/* Logo and Header */}
      <div className="mb-4 flex flex-col items-center">
        <img 
          src={logo} 
          alt="LGU Naval EMS Logo" 
          className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" 
        />
        <h1 className="mt-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-center text-xl font-bold text-transparent sm:text-2xl"
          style={{
            WebkitTextStroke: "1px white",
            WebkitTextFillColor: "transparent",
          }}
        >
          LGU Naval EMS Attendance
        </h1>
      </div>

      {/* Scanner Container */}
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-6">
        <h2 className="mb-3 text-center text-lg font-bold sm:text-xl">QR Code Scanner</h2>

        {/* Scanner viewport */}
        <div className="relative">
          <div
            id="qr-reader"
            className="w-full rounded-xl border-4 border-dashed border-purple-300"
            style={{ aspectRatio: "1/1" }}
          />
          
          {/* Scanning instructions */}
          <p className="mt-3 text-center text-xs text-gray-600 sm:text-sm">
            Point your camera at a QR Code
          </p>
        </div>

        {/* Control buttons */}
        <div className="mt-4 flex justify-center gap-3">
          {!isScanning ? (
            <button
              onClick={startScanner}
              disabled={isTransitioning}
              className={`flex-1 rounded-lg px-4 py-3 font-semibold sm:px-6 sm:py-2 ${
                isTransitioning
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Start Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              disabled={isTransitioning}
              className={`flex-1 rounded-lg px-4 py-3 font-semibold sm:px-6 sm:py-2 ${
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
          <div className="mt-4 rounded-lg border border-green-300 bg-green-100 p-3 text-center text-green-800">
            <p className="text-sm">
              <strong>Scanned Code:</strong> {scanResult.code}
            </p>
            <p className="text-sm">
              <strong>Time:</strong> {scanResult.timestamp}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}