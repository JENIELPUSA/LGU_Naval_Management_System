import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?worker";
import Sidebar from "./SidebarPDF";
import { AuthContext } from "../../../contexts/AuthContext";
import Notes from "./notecomponents";
import LoadingOverlay from "../../../ReusableFolder/LoadingOverlay";
import { ProposalDisplayContext } from "../../../contexts/ProposalContext/ProposalContext";
import SuccessFailed from "../../../ReusableFolder/SuccessandField";
import ApprovedRejectForm from "./ApproveRejectForm";
pdfjs.GlobalWorkerOptions.workerPort = new pdfWorker();

const PdfViewer = () => {
    const { FetchProposalDisplay } = useContext(ProposalDisplayContext);
    const navigate = useNavigate();
    const location = useLocation();
    const fileData = location.state?.fileData;
    const { authToken } = useContext(AuthContext);
    const { fileId } = useParams();

    const [fileUrl, setFileUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.2);
    const pdfWrapperRef = useRef(null);
    const pageContainerRef = useRef(null);
    const [uploadedSignature, setUploadedSignature] = useState(null);
    const [placedSignatures, setPlacedSignatures] = useState([]);
    const [placedTexts, setPlacedTexts] = useState([]);
    const [isApproved, setApproved] = useState(false);
    const [isApproveData, setApprovedData] = useState([]);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteData, setNoteData] = useState(null);
    const [isRecieveForm, setRecieveForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalStatus, setModalStatus] = useState("success");
    const [isDragging, setIsDragging] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedElementType, setSelectedElementType] = useState(null); // 'signature' or 'text'
    const [draggingElementId, setDraggingElementId] = useState(null);
    const [draggingElementType, setDraggingElementType] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const originalPdfBytesRef = useRef(null);
    const [status, setStatus] = useState(""); // Add status state

    useEffect(() => {
        let canceled = false;
        let objectUrl;

        const fetchPDF = async () => {
            try {
                const meta = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/${fileId}`);
                const fileData = meta.data.data;
                const status = fileData.status;
                setStatus(status); // Set the status

                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/stream/${fileId}`, {
                    responseType: "blob",
                });

                let originalBlob = res.data;
                let currentPdfBytes = await originalBlob.arrayBuffer();

                // Add watermark based on status
                if (status === "approved" || status === "rejected") {
                    try {
                        const pdfDoc = await PDFDocument.load(currentPdfBytes);
                        const pages = pdfDoc.getPages();
                        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                        for (const page of pages) {
                            const { width, height } = page.getSize();

                            page.drawText(status.toUpperCase(), {
                                x: width / 2 - 100,
                                y: height / 2,
                                size: 60,
                                font: font,
                                color: status === "approved" ? rgb(0, 0, 0) : rgb(0, 0, 0),
                                opacity: 0.1,
                                rotate: degrees(45),
                            });
                        }

                        currentPdfBytes = await pdfDoc.save();
                    } catch (err) {
                        console.error("Failed to add watermark. Using original PDF.", err);
                    }
                }

                originalPdfBytesRef.current = currentPdfBytes;

                objectUrl = URL.createObjectURL(new Blob([currentPdfBytes], { type: "application/pdf" }));
                if (!canceled) setFileUrl(objectUrl);
            } catch (error) {
                console.error("Failed to load PDF:", error);
            }
        };

        if (fileId) fetchPDF();

        return () => {
            canceled = true;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
            setFileUrl(null);
        };
    }, [fileId]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handleRejects = (ID, status) => {
        setNoteData({ ID, status });
        setShowNoteModal(true);
    };

    const handlePrint = async () => {
        try {
            const pdfDoc = await PDFDocument.load(originalPdfBytesRef.current);
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = url;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // Tanggalin ang iframe at i-revoke ang URL kapag sarado na ang print dialog
                iframe.contentWindow.onafterprint = () => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(url);
                };
            };
        } catch (err) {
            console.error("❌ Error during PDF print:", err);
            alert("May error habang nagpi-print ng PDF. Tingnan ang console.");
        }
    };

    const handleZoomIn = () => setScale((prev) => prev + 0.2);
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5)); // Minimum scale ng 0.5

    const handleDownload = async () => {
        try {
            const pdfDoc = await PDFDocument.load(originalPdfBytesRef.current);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boundingBox = pageContainerRef.current?.getBoundingClientRect();
            const renderedPageWidth = boundingBox?.width ?? 1;
            const renderedPageHeight = boundingBox?.height ?? 1;

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { width: pdfPageWidth, height: pdfPageHeight } = page.getSize();
                const scaleX = pdfPageWidth / renderedPageWidth;
                const scaleY = pdfPageHeight / renderedPageHeight;

                for (const sig of placedSignatures.filter((s) => s.page === i + 1)) {
                    const imageBytes = await fetch(sig.src).then((res) => res.arrayBuffer());
                    const pdfImage = sig.src.includes("png") ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);

                    const scaledX = sig.x * scaleX;
                    const scaledY = sig.y * scaleY;
                    const scaledWidth = sig.width * scaleX;
                    const scaledHeight = sig.height * scaleY;
                    const adjustedX = scaledX + 10;
                    const adjustedY = pdfPageHeight - scaledY - scaledHeight - 2;
                    page.drawImage(pdfImage, {
                        x: adjustedX,
                        y: adjustedY,
                        width: scaledWidth,
                        height: scaledHeight,
                    });
                }
                for (const text of placedTexts.filter((t) => t.page === i + 1)) {
                    const scaledX = text.x * scaleX;
                    const scaledY = text.y * scaleY;
                    const scaledFontSize = text.fontSize * scaleY;

                    const adjustedTextX = scaledX - 30;
                    const adjustedTextY = pdfPageHeight - scaledY - scaledFontSize - 16;

                    const calculatedMaxWidth = (text.width + 40) * scaleX;

                    // Measure actual text width and compute center
                    const textWidth = font.widthOfTextAtSize(text.value, scaledFontSize);
                    const centerX = adjustedTextX + (calculatedMaxWidth - textWidth) / 2;

                    console.log("🔤 Text:", {
                        id: text.id,
                        value: text.value,
                        originalX: text.x,
                        originalY: text.y,
                        scaledX,
                        scaledY,
                        adjustedTextX,
                        adjustedTextY,
                        textWidth,
                        centerX,
                        fontSize: text.fontSize,
                        scaledFontSize,
                        maxWidth: calculatedMaxWidth,
                    });

                    page.drawText(text.value, {
                        x: centerX,
                        y: adjustedTextY,
                        font,
                        size: scaledFontSize,
                        color: rgb(
                            parseInt(text.fontColor.slice(1, 3), 16) / 255,
                            parseInt(text.fontColor.slice(3, 5), 16) / 255,
                            parseInt(text.fontColor.slice(5, 7), 16) / 255,
                        ),
                        maxWidth: calculatedMaxWidth,
                        lineHeight: scaledFontSize * 1.2,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "document_with_changes.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("❌ Error during PDF download:", err);
            alert("May error habang dini-download ang PDF. Tingnan ang console.");
        }
    };

    const handleSave = async () => {
        try {
            if (!originalPdfBytesRef.current) {
                alert("❌ Original PDF not loaded");
                return;
            }

            const pdfDoc = await PDFDocument.load(originalPdfBytesRef.current);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const boundingBox = pageContainerRef.current?.getBoundingClientRect();
            const renderedPageWidth = boundingBox?.width ?? 1;
            const renderedPageHeight = boundingBox?.height ?? 1;

            // Loop through pages
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { width: pdfPageWidth, height: pdfPageHeight } = page.getSize();

                const scaleX = pdfPageWidth / renderedPageWidth;
                const scaleY = pdfPageHeight / renderedPageHeight;

                // --- Signatures ---
                const pageSignatures = placedSignatures.filter((s) => s.page === i + 1);
                for (const sig of pageSignatures) {
                    const imageBytes = await fetch(sig.src).then((res) => res.arrayBuffer());
                    const pdfImage = sig.src.includes("png") ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);

                    const scaledWidth = sig.width * scaleX;
                    const scaledHeight = sig.height * scaleY;
                    const scaledX = sig.x * scaleX;
                    const scaledY = sig.y * scaleY;

                    const adjustedX = sig.isApprovedLogo
                        ? (pdfPageWidth - scaledWidth) / 2 // center horizontally
                        : scaledX;

                    const adjustedY = pdfPageHeight - scaledY - scaledHeight;

                    page.drawImage(pdfImage, {
                        x: adjustedX,
                        y: adjustedY,
                        width: scaledWidth,
                        height: scaledHeight,
                    });
                }

                // --- Texts ---
                const pageTexts = placedTexts.filter((t) => t.page === i + 1);
                for (const text of pageTexts) {
                    const scaledX = text.x * scaleX;
                    const scaledY = text.y * scaleY;
                    const scaledFontSize = text.fontSize * scaleY;

                    const adjustedTextY = pdfPageHeight - scaledY - scaledFontSize;

                    const calculatedMaxWidth = (text.width + 40) * scaleX;
                    const textWidth = font.widthOfTextAtSize(text.value, scaledFontSize);

                    // Center text horizontally
                    const centerX = scaledX + (calculatedMaxWidth - textWidth) / 2;

                    const [r, g, b] = [
                        parseInt(text.fontColor.slice(1, 3), 16) / 255,
                        parseInt(text.fontColor.slice(3, 5), 16) / 255,
                        parseInt(text.fontColor.slice(5, 7), 16) / 255,
                    ];

                    page.drawText(text.value, {
                        x: centerX,
                        y: adjustedTextY,
                        font,
                        size: scaledFontSize,
                        color: rgb(r, g, b),
                        maxWidth: calculatedMaxWidth,
                        lineHeight: scaledFontSize * 1.2,
                    });
                }
            }

            // --- Save PDF ---
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });

            // Generate new versioned filename
            const originalName = fileData?.fileName || "document.pdf";
            const baseMatch = originalName.match(/^(.*?)(?:_v(\d+))?\.pdf$/i);
            const baseName = baseMatch?.[1] || "document";
            const currentVersion = baseMatch?.[2] ? parseInt(baseMatch[2]) : 0;
            const newFilename = `${baseName}_v${currentVersion + 1}.pdf`;

            // --- Upload to backend / Cloudinary ---
            const formData = new FormData();
            formData.append("file", blob, newFilename);
            formData.append("fileId", fileData._id);
            formData.append("title", fileData.title);
            formData.append("description", fileData.description);
            formData.append("remarks", fileData.remarks || "");
            formData.append("submitted_by", fileData.submitted_by || "");
            formData.append("status", "approved");

            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/Proposal/UpdateCloudinary`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.status === "success") {
                setModalStatus("success");
                setShowModal(true);
                FetchProposalDisplay();
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            } else {
                alert("⚠️ Update failed. Please try again.");
            }
        } catch (err) {
            console.error("❌ Error during PDF save:", err);

            if (err.response) {
                const status = err.response.status;
                const message = err.response.data?.message || "Unknown server error";
                console.error("📡 Server error:", { status, message, errorDetails: err.response.data?.error });
                alert(`Server Error (${status}): ${message}`);
            } else if (err.request) {
                console.error("📭 No response received:", err.request);
                alert("Walang natanggap na response mula sa server.");
            } else {
                console.error("Request setup error:", err.message);
                alert("May nangyaring error habang naghahanda ng request.");
            }
        }
    };

    const handleApprovedReject = () => {
        setApproved(true);
        setApprovedData(fileData);
    };

    const handleCloseModal = () => {
        setRecieveForm(false);
        setApproved(false);
        setShowNoteModal(false);
    };

    const hanndlepreview = () => {
        setRecieveForm(true);
    };

    // New function to handle signature upload from sidebar
    const handleUploadSignature = (signatureDataUrl) => {
        setUploadedSignature(signatureDataUrl);
    };

    // Handle drag over event on the PDF container
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setIsDragging(true);
    };

    // Handle drag leave event
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const type = e.dataTransfer.getData("type");

        if (type === "signature") {
            const signatureData = e.dataTransfer.getData("signature");
            if (!signatureData) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newSignature = {
                id: Date.now(),
                src: signatureData,
                page: pageNumber,
                x: x,
                y: y,
                width: 100,
                height: 50,
            };

            setPlacedSignatures([...placedSignatures, newSignature]);
            setSelectedElement(newSignature.id);
            setSelectedElementType("signature");
        } else if (type === "text") {
            const textDataStr = e.dataTransfer.getData("text");
            if (!textDataStr) return;

            const textData = JSON.parse(textDataStr);
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newText = {
                id: Date.now().toString(),
                value: textData.text,
                page: pageNumber,
                x: x,
                y: y,
                fontSize: textData.style.fontSize,
                fontColor: textData.style.color,
                fontFamily: textData.style.fontFamily,
                width: 200, // Default width for text
                height: textData.style.fontSize * 1.5,
            };

            setPlacedTexts([...placedTexts, newText]);
            setSelectedElement(newText.id);
            setSelectedElementType("text");
        }
    };

    // Handle text addition from sidebar
    const handleAddText = (textData) => {
        const newText = {
            id: textData.id,
            value: textData.text,
            page: pageNumber,
            x: 50, // Default position
            y: 50,
            fontSize: textData.style.fontSize,
            fontColor: textData.style.color,
            fontFamily: textData.style.fontFamily,
            width: 200,
            height: textData.style.fontSize * 1.5,
        };

        setPlacedTexts([...placedTexts, newText]);
        setSelectedElement(newText.id);
        setSelectedElementType("text");
    };

    // Function to handle element selection
    const handleElementSelect = (elementId, elementType) => {
        if (elementId === selectedElement && elementType === selectedElementType) {
            setSelectedElement(null);
            setSelectedElementType(null);
        } else {
            setSelectedElement(elementId);
            setSelectedElementType(elementType);
        }
    };

    // Function to move element
    const moveElement = (direction, amount = 5) => {
        if (!selectedElement || !selectedElementType) return;

        if (selectedElementType === "signature") {
            setPlacedSignatures(
                placedSignatures.map((sig) => {
                    if (sig.id === selectedElement) {
                        switch (direction) {
                            case "up":
                                return { ...sig, y: sig.y - amount };
                            case "down":
                                return { ...sig, y: sig.y + amount };
                            case "left":
                                return { ...sig, x: sig.x - amount };
                            case "right":
                                return { ...sig, x: sig.x + amount };
                            default:
                                return sig;
                        }
                    }
                    return sig;
                }),
            );
        } else if (selectedElementType === "text") {
            setPlacedTexts(
                placedTexts.map((text) => {
                    if (text.id === selectedElement) {
                        switch (direction) {
                            case "up":
                                return { ...text, y: text.y - amount };
                            case "down":
                                return { ...text, y: text.y + amount };
                            case "left":
                                return { ...text, x: text.x - amount };
                            case "right":
                                return { ...text, x: text.x + amount };
                            default:
                                return text;
                        }
                    }
                    return text;
                }),
            );
        }
    };

    // Function to resize element
    const resizeElement = (type, amount = 5) => {
        if (!selectedElement || !selectedElementType) return;

        if (selectedElementType === "signature") {
            setPlacedSignatures(
                placedSignatures.map((sig) => {
                    if (sig.id === selectedElement) {
                        switch (type) {
                            case "increase":
                                return {
                                    ...sig,
                                    width: sig.width + amount,
                                    height: sig.height + amount * (sig.height / sig.width),
                                };
                            case "decrease":
                                const newWidth = Math.max(20, sig.width - amount);
                                const newHeight = Math.max(20, sig.height - amount * (sig.height / sig.width));
                                return { ...sig, width: newWidth, height: newHeight };
                            default:
                                return sig;
                        }
                    }
                    return sig;
                }),
            );
        } else if (selectedElementType === "text") {
            setPlacedTexts(
                placedTexts.map((text) => {
                    if (text.id === selectedElement) {
                        switch (type) {
                            case "increase":
                                return {
                                    ...text,
                                    fontSize: text.fontSize + 2,
                                    height: (text.fontSize + 2) * 1.5,
                                };
                            case "decrease":
                                const newSize = Math.max(8, text.fontSize - 2);
                                return {
                                    ...text,
                                    fontSize: newSize,
                                    height: newSize * 1.5,
                                };
                            default:
                                return text;
                        }
                    }
                    return text;
                }),
            );
        }
    };

    // Function to remove element
    const removeElement = () => {
        if (!selectedElement || !selectedElementType) return;

        if (selectedElementType === "signature") {
            setPlacedSignatures(placedSignatures.filter((sig) => sig.id !== selectedElement));
        } else if (selectedElementType === "text") {
            setPlacedTexts(placedTexts.filter((text) => text.id !== selectedElement));
        }

        setSelectedElement(null);
        setSelectedElementType(null);
    };

    // Handle mouse down on element (start dragging)
    const handleElementMouseDown = (e, elementId, elementType) => {
        e.stopPropagation();
        setDraggingElementId(elementId);
        setDraggingElementType(elementType);
        setSelectedElement(elementId);
        setSelectedElementType(elementType);

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        setDragOffset({ x: offsetX, y: offsetY });
    };

    // Handle mouse move on document (for dragging elements)
    const handleDocumentMouseMove = useCallback(
        (e) => {
            if (draggingElementId === null) return;

            const containerRect = pageContainerRef.current.getBoundingClientRect();
            const x = e.clientX - containerRect.left - dragOffset.x;
            const y = e.clientY - containerRect.top - dragOffset.y;

            if (draggingElementType === "signature") {
                setPlacedSignatures(
                    placedSignatures.map((sig) => {
                        if (sig.id === draggingElementId) {
                            return { ...sig, x, y };
                        }
                        return sig;
                    }),
                );
            } else if (draggingElementType === "text") {
                setPlacedTexts(
                    placedTexts.map((text) => {
                        if (text.id === draggingElementId) {
                            return { ...text, x, y };
                        }
                        return text;
                    }),
                );
            }
        },
        [draggingElementId, draggingElementType, dragOffset, placedSignatures, placedTexts],
    );

    // Handle mouse up (stop dragging)
    const handleDocumentMouseUp = useCallback(() => {
        setDraggingElementId(null);
        setDraggingElementType(null);
    }, []);

    // Add event listeners for dragging
    useEffect(() => {
        document.addEventListener("mousemove", handleDocumentMouseMove);
        document.addEventListener("mouseup", handleDocumentMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleDocumentMouseMove);
            document.removeEventListener("mouseup", handleDocumentMouseUp);
        };
    }, [handleDocumentMouseMove, handleDocumentMouseUp]);

    return (
        <div className="z-[999] flex h-screen w-full">
            <div
                className="flex flex-1 justify-center overflow-y-auto"
                ref={pdfWrapperRef}
            >
                {fileUrl ? (
                    <div className="w-full max-w-5xl">
                        <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <div
                                ref={pageContainerRef}
                                className={`relative flex w-full items-center justify-center ${isDragging ? "border-2 border-dashed border-blue-400 bg-blue-50" : ""}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="border border-gray-200"
                                />

                                {/* Render placed signatures on the PDF */}
                                {placedSignatures
                                    .filter((sig) => sig.page === pageNumber)
                                    .map((sig) => (
                                        <div
                                            key={sig.id}
                                            style={{
                                                position: "absolute",
                                                left: sig.x,
                                                top: sig.y,
                                                width: sig.width,
                                                height: sig.height,
                                                border:
                                                    selectedElement === sig.id && selectedElementType === "signature" ? "2px dashed blue" : "none",
                                                cursor: "move",
                                            }}
                                            onClick={() => handleElementSelect(sig.id, "signature")}
                                            onMouseDown={(e) => handleElementMouseDown(e, sig.id, "signature")}
                                        >
                                            <img
                                                src={sig.src}
                                                alt="Signature"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    pointerEvents: "none",
                                                }}
                                            />
                                        </div>
                                    ))}

                                {/* Render placed texts on the PDF */}
                                {placedTexts
                                    .filter((text) => text.page === pageNumber)
                                    .map((text) => (
                                        <div
                                            key={text.id}
                                            style={{
                                                position: "absolute",
                                                left: text.x,
                                                top: text.y,
                                                fontSize: `${text.fontSize}px`,
                                                color: text.fontColor,
                                                fontFamily: text.fontFamily,
                                                border: selectedElement === text.id && selectedElementType === "text" ? "2px dashed blue" : "none",
                                                backgroundColor:
                                                    selectedElement === text.id && selectedElementType === "text"
                                                        ? "rgba(0, 0, 255, 0.1)"
                                                        : "transparent",
                                                padding: "2px 4px",
                                                cursor: "move",
                                                maxWidth: `${text.width}px`,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                            onClick={() => handleElementSelect(text.id, "text")}
                                            onMouseDown={(e) => handleElementMouseDown(e, text.id, "text")}
                                        >
                                            {text.value}
                                        </div>
                                    ))}
                            </div>
                        </Document>
                    </div>
                ) : (
                    <LoadingOverlay message="Loading PDF..." />
                )}
            </div>

            {/* Sidebar */}
            <div className="w-[300px]">
                <Sidebar
                    onPrint={handlePrint}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onDownload={handleDownload}
                    onSave={handleSave}
                    scale={scale}
                    numPages={numPages}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    fileUrl={fileUrl}
                    fileData={fileData}
                    onPreview={hanndlepreview}
                    ApprovedReview={handleApprovedReject}
                    onUploadSignature={handleUploadSignature}
                    onAddText={handleAddText}
                    status={status} // Pass status to sidebar
                />
            </div>

            {selectedElement && selectedElementType && (
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform flex-col space-y-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="mb-1 text-center text-sm font-medium">{selectedElementType === "signature" ? "Signature" : "Text"} Controls</div>

                    <div className="flex justify-center space-x-2">
                        <button
                            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                            onClick={() => moveElement("up")}
                            title="Move Up"
                        >
                            ↑
                        </button>
                        <button
                            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                            onClick={() => moveElement("down")}
                            title="Move Down"
                        >
                            ↓
                        </button>
                        <button
                            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                            onClick={() => moveElement("left")}
                            title="Move Left"
                        >
                            ←
                        </button>
                        <button
                            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                            onClick={() => moveElement("right")}
                            title="Move Right"
                        >
                            →
                        </button>
                    </div>

                    <div className="flex justify-center space-x-2">
                        <button
                            className="rounded bg-green-500 p-2 text-white hover:bg-green-600"
                            onClick={() => resizeElement("increase")}
                            title={selectedElementType === "signature" ? "Increase Size" : "Increase Font Size"}
                        >
                            +
                        </button>
                        <button
                            className="rounded bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                            onClick={() => resizeElement("decrease")}
                            title={selectedElementType === "signature" ? "Decrease Size" : "Decrease Font Size"}
                        >
                            -
                        </button>
                        <button
                            className="rounded bg-red-500 p-2 text-white hover:bg-red-600"
                            onClick={removeElement}
                            title={`Remove ${selectedElementType === "signature" ? "Signature" : "Text"}`}
                        >
                            ×
                        </button>
                    </div>

                    <div className="mt-1 text-center text-xs text-gray-500">Click and drag to move the {selectedElementType}</div>
                </div>
            )}

            {/* Modals and Popups */}
            <SuccessFailed
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                status={modalStatus}
            />
            <Notes
                data={noteData}
                isOpen={showNoteModal}
                onClose={handleCloseModal}
            />
            <ApprovedRejectForm
                isOpen={isApproved}
                onClose={handleCloseModal}
                fileData={isApproveData}
                handleApprove={handleSave}
                handleRejects={handleRejects}
            />
        </div>
    );
};

export default PdfViewer;
