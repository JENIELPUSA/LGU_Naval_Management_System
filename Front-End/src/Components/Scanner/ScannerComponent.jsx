import React, { useEffect, useState, useRef, useContext } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ParticipantDisplayContext } from "../../contexts/ParticipantContext/ParticipantContext";
import logo from "../../../src/assets/logo-login.png";
import LoadingOverlay from "../../ReusableFolder/LoadingOverlay";

export default function ScannerModal({ isOpen, onClose }) {
  const { Attendance } = useContext(ParticipantDisplayContext);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedAction, setSelectedAction] = useState("Check-In");
  const scannerRef = useRef(null);
  const beepSound = useRef(
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
  );

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup scanner on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setScanResult(null);
    } else if (!isScanning && !loading) {
      // Auto-start when modal opens (optional)
      // startScanner();
    }
  }, [isOpen]);

  // Restart on action change
  useEffect(() => {
    if (isScanning && !isTransitioning && isOpen) {
      const restart = async () => {
        await stopScanner();
        setTimeout(() => {
          if (isOpen && !isScanning) startScanner();
        }, 300);
      };
      restart();
    }
  }, [selectedAction, isOpen]);

  const startScanner = async () => {
    if (!isOpen || isScanning || isTransitioning) return;
    setIsTransitioning(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      const width = isMobile ? window.innerWidth * 0.9 : 300;
      const qrboxSize = Math.min(250, width);

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: qrboxSize, height: qrboxSize } },
        (decodedText) => {
          const scanData = {
            code: decodedText,
            timestamp: new Date().toLocaleString(),
            attendance_status: selectedAction,
          };
          setScanResult(scanData);
          beepSound.current.play().catch(() => {});
          Attendance(scanData, selectedAction);
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

  // Cleanup on unmount
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4">
          <img
            src={logo}
            alt="LGU Naval EMS Logo"
            className="h-12 w-12 sm:h-16 sm:w-16"
          />
          <h1 className="mt-1 text-center text-base font-bold text-gray-800 sm:text-lg">
            LGU Naval EMS Attendance
          </h1>
        </div>

        <div className="px-3 pb-4 sm:px-5 sm:pb-5">
          {/* Action Dropdown */}
          <div className="mb-2 sm:mb-3">
            <label className="block text-xs font-medium text-gray-700 sm:text-sm">
              Select Action:
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="Check-In">Check-In</option>
              <option value="Check-Out">Check-Out</option>
            </select>
          </div>

          {/* QR Reader */}
          <div className="relative my-2">
            <div
              id="qr-reader"
              className="mx-auto aspect-square w-full max-w-[250px] rounded-xl border-2 border-dashed border-purple-300 bg-gray-50"
            />
            <p className="mt-1 text-center text-[10px] text-gray-600 sm:text-xs">
              Point your camera at a QR code
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-2 flex justify-center gap-2">
            {!isScanning ? (
              <button
                onClick={startScanner}
                disabled={isTransitioning}
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${
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
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${
                  isTransitioning
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Stop Scanner
              </button>
            )}
          </div>

          {/* Scan Result */}
          {scanResult && (
            <div className="mt-2 rounded-lg border border-green-300 bg-green-50 p-2 text-center text-[10px] text-green-800 sm:p-3 sm:text-xs">
              <p>
                <strong>Action:</strong> {scanResult.attendance_status}
              </p>
              <p>
                <strong>Code:</strong> {scanResult.code}
              </p>
              <p>
                <strong>Time:</strong> {scanResult.timestamp}
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-center border-t border-gray-200 pt-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}