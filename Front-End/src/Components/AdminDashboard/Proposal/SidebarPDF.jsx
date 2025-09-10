import React, { useContext, useState, useRef } from "react";
import { ZoomIn, ZoomOut, Printer, ArrowLeft, ArrowRight, Download, CheckCircle, Eye, FileText, PenTool, X, Type } from "lucide-react";
import { Document, Page } from "react-pdf";
import { AuthContext } from "../../../contexts/AuthContext";

const Sidebar = ({
    onPrint,
    onZoomIn,
    onZoomOut,
    onDownload,
    scale,
    numPages,
    pageNumber,
    setPageNumber,
    fileUrl,
    fileData,
    ApprovedReview,
    onUploadSignature,
    onAddText,
}) => {
    const { role } = useContext(AuthContext);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [textInput, setTextInput] = useState("");
    const [textStyle, setTextStyle] = useState({
        fontSize: 16,
        color: "#000000",
        fontFamily: "Arial",
    });
    const fileInputRef = useRef(null);

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
            case "Pending":
                return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
        }
    };

    const shouldShowApprovalButton = () => {
        return (
            role !== "admin" &&
            (role === "officer" || fileData.status === "Pending") &&
            fileData.status !== "Rejected" &&
            fileData.status !== "Approved"
        );
    };

    // Function to remove white/black background from signature
    const removeSignatureBackground = (imageDataUrl) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0);

                // Get the image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Define color similarity thresholds
                const whiteThreshold = 230; // For white background
                const blackThreshold = 25; // For black background

                // Check if the image has a white or black background by sampling corners
                const corners = [
                    { x: 0, y: 0 }, // Top-left
                    { x: canvas.width - 1, y: 0 }, // Top-right
                    { x: 0, y: canvas.height - 1 }, // Bottom-left
                    { x: canvas.width - 1, y: canvas.height - 1 }, // Bottom-right
                ];

                let whiteCount = 0;
                let blackCount = 0;

                corners.forEach((corner) => {
                    const index = (corner.y * canvas.width + corner.x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];

                    // Check if pixel is white
                    if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
                        whiteCount++;
                    }
                    // Check if pixel is black
                    else if (r < blackThreshold && g < blackThreshold && b < blackThreshold) {
                        blackCount++;
                    }
                });

                // Determine if we should remove white or black background
                const removeWhite = whiteCount >= 2; // At least 2 white corners
                const removeBlack = blackCount >= 2; // At least 2 black corners

                // Process each pixel to remove background
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Check if pixel should be made transparent
                    if (
                        (removeWhite && r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) ||
                        (removeBlack && r < blackThreshold && g < blackThreshold && b < blackThreshold)
                    ) {
                        // Make pixel transparent
                        data[i + 3] = 0;
                    }
                }

                // Put the modified image data back to the canvas
                ctx.putImageData(imageData, 0, 0);

                // Convert canvas to data URL and resolve
                resolve(canvas.toDataURL("image/png"));
            };
            img.src = imageDataUrl;
        });
    };

    // Handle file selection for signature
    const handleSignatureUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.match("image.*")) {
                alert("Please select an image file for your signature.");
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    // Remove background before setting preview
                    const processedImage = await removeSignatureBackground(e.target.result);
                    setSignaturePreview(processedImage);

                    if (onUploadSignature) {
                        onUploadSignature(processedImage);
                    }
                } catch (error) {
                    console.error("Error processing signature:", error);
                    // Fallback to original image if processing fails
                    setSignaturePreview(e.target.result);
                    if (onUploadSignature) {
                        onUploadSignature(e.target.result);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Clear the signature preview
    const clearSignature = () => {
        setSignaturePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle drag start for the signature preview
    const handleDragStart = (e) => {
        e.dataTransfer.setData("signature", signaturePreview);
        e.dataTransfer.setData("type", "signature");
    };

    // Handle text addition
    const handleAddText = () => {
        if (textInput.trim() === "") {
            alert("Please enter some text");
            return;
        }

        if (onAddText) {
            onAddText({
                text: textInput,
                style: textStyle,
                id: Date.now().toString(),
            });
        }

        // Reset text input
        setTextInput("");
    };

    // Handle drag start for text
    const handleTextDragStart = (e, textData) => {
        e.dataTransfer.setData("text", JSON.stringify(textData));
        e.dataTransfer.setData("type", "text");
    };

    return (
        <nav className="print-hidden left-0 top-0 mb-8 flex max-h-[100vh] w-72 flex-col gap-6 overflow-y-auto rounded-2xl border border-gray-200/50 bg-white/80 p-6 text-gray-800 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-gray-700/50 dark:bg-gray-900/80 dark:text-gray-100 dark:shadow-2xl">
            {/* Header Section */}
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                    <FileText className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Document Viewer</h2>
                    <div className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(fileData.status)}`}>
                        {fileData.status || "Unknown"}
                    </div>
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Zoom</h3>
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400">
                        {(scale * 100).toFixed(0)}%
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onZoomIn}
                        className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl active:scale-95"
                        title="Zoom In"
                    >
                        <ZoomIn className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </button>
                    <button
                        onClick={onZoomOut}
                        className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700 hover:shadow-xl active:scale-95"
                        title="Zoom Out"
                    >
                        <ZoomOut className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </button>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Navigation</h3>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {pageNumber} of {numPages || 1}
                    </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <button
                        onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="group flex items-center justify-center rounded-lg bg-white p-2 shadow-md transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 disabled:dark:hover:bg-gray-700"
                        title="Previous Page"
                    >
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">{pageNumber}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">of {numPages || 1}</span>
                    </div>

                    <button
                        onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
                        disabled={pageNumber >= numPages}
                        className="group flex items-center justify-center rounded-lg bg-white p-2 shadow-md transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600 disabled:dark:hover:bg-gray-700"
                        title="Next Page"
                    >
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </div>
            </div>

            {/* Text Addition Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Add Text</h3>
                </div>

                <div className="space-y-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter text to add to document"
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        rows="3"
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Font Size</label>
                            <select
                                value={textStyle.fontSize}
                                onChange={(e) => setTextStyle({ ...textStyle, fontSize: parseInt(e.target.value) })}
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="12">12px</option>
                                <option value="14">14px</option>
                                <option value="16">16px</option>
                                <option value="18">18px</option>
                                <option value="20">20px</option>
                                <option value="24">24px</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Color</label>
                            <input
                                type="color"
                                value={textStyle.color}
                                onChange={(e) => setTextStyle({ ...textStyle, color: e.target.value })}
                                className="h-9 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Font Family</label>
                        <select
                            value={textStyle.fontFamily}
                            onChange={(e) => setTextStyle({ ...textStyle, fontFamily: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Verdana">Verdana</option>
                        </select>
                    </div>

                    <button
                        onClick={handleAddText}
                        disabled={!textInput.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <Type className="h-4 w-4" />
                        <span className="text-sm font-medium">Create Text Element</span>
                    </button>
                </div>

                {textInput && (
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Preview:</span>
                        </div>
                        <div
                            className="rounded-lg border border-dashed border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-700"
                            draggable
                            onDragStart={(e) =>
                                handleTextDragStart(e, {
                                    text: textInput,
                                    style: textStyle,
                                    id: "preview",
                                })
                            }
                        >
                            <span
                                style={{
                                    fontSize: `${textStyle.fontSize}px`,
                                    color: textStyle.color,
                                    fontFamily: textStyle.fontFamily,
                                }}
                            >
                                {textInput}
                            </span>
                        </div>
                        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">Drag this text to the document</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Actions</h3>
                <div className={`grid gap-3 ${shouldShowApprovalButton() ? "grid-cols-1" : "grid-cols-2"}`}>
                    <button
                        onClick={onDownload}
                        className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl active:scale-95"
                        title="Download Document"
                    >
                        <Download className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="hidden font-medium sm:inline">Download</span>
                    </button>

                    <button
                        onClick={onPrint}
                        className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl active:scale-95"
                        title="Print Document"
                    >
                        <Printer className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="hidden font-medium sm:inline">Print</span>
                    </button>

                    {role === "admin" &&
                        fileData.status !== "rejected" &&
                        fileData.status !== "approved" && (
                            <button
                                onClick={ApprovedReview}
                                className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                title="Done Review"
                            >
                                <CheckCircle className="h-5 w-5" />
                            </button>
                        )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleSignatureUpload}
                        accept="image/*"
                        className="hidden"
                        id="signature-upload"
                    />

                    {/* Upload Signature Button */}
                    <label
                        htmlFor="signature-upload"
                        className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-rose-600 hover:shadow-xl active:scale-95"
                        title="Upload Signature"
                    >
                        <PenTool className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span className="hidden font-medium sm:inline">Upload Signature</span>
                    </label>

                    {shouldShowApprovalButton() && (
                        <button
                            onClick={ApprovedReview}
                            className="group col-span-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-emerald-600 hover:to-green-700 hover:shadow-xl active:scale-95"
                            title="Approve Document"
                        >
                            <CheckCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                            <span className="font-semibold">Complete Review</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Signature Preview Section */}
            {signaturePreview && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-gray-500" />
                        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Signature Preview</h3>
                    </div>
                    <div className="relative rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
                        <div
                            className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-gray-700"
                            draggable
                            onDragStart={handleDragStart}
                        >
                            <img
                                src={signaturePreview}
                                alt="Signature preview"
                                className="max-h-32 object-contain"
                                style={{ backgroundColor: "transparent" }}
                            />
                        </div>
                        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                            Background removed. Drag this signature to the document.
                        </p>
                        <button
                            onClick={clearSignature}
                            className="absolute right-2 top-2 rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            title="Remove signature"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Page Previews */}
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Page Previews</h3>
                </div>
                <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 max-h-[40vh] space-y-3 overflow-y-auto rounded-xl bg-gray-50 p-4 dark:bg-gray-800/30">
                    {fileUrl && numPages > 0 && (
                        <Document
                            file={fileUrl}
                            onLoadError={(err) => console.error("PDF preview load error:", err)}
                        >
                            {Array.from({ length: numPages }, (_, index) => (
                                <div
                                    key={index}
                                    className={`group cursor-pointer rounded-lg p-3 transition-all duration-300 ease-out ${
                                        pageNumber === index + 1
                                            ? "scale-105 transform bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                            : "hover:scale-102 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md dark:bg-gray-700 dark:hover:bg-gray-600"
                                    }`}
                                    onClick={() => setPageNumber(index + 1)}
                                >
                                    <div className="overflow-hidden rounded-md border-2 border-gray-200 shadow-sm dark:border-gray-600">
                                        <Page
                                            pageNumber={index + 1}
                                            scale={0.2}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            className="transition-transform duration-200 group-hover:scale-105"
                                        />
                                    </div>
                                    <p
                                        className={`mt-2 text-center text-xs font-medium transition-colors ${
                                            pageNumber === index + 1
                                                ? "text-white"
                                                : "text-gray-600 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
                                        }`}
                                    >
                                        Page {index + 1}
                                    </p>
                                </div>
                            ))}
                        </Document>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
