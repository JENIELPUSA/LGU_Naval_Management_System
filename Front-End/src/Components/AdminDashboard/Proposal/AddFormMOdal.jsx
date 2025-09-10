import React, { useState, useRef, useEffect } from "react";
import { FileText, MessageSquareText, X, Paperclip, Eye, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const AddFormModal = ({ isOpen, onClose, onSubmit, formData, setFormData, isEditing, initialFileUrl, initialFileName }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [pdfError, setPdfError] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFileName(initialFileName || "");
                setPdfPreviewUrl(initialFileUrl || "");
                setFile(null);
            } else {
                setFileName("");
                setPdfPreviewUrl("");
                setFile(null);
                setFormData({ title: "", description: "" });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    }, [isOpen, isEditing, initialFileName, initialFileUrl, setFormData]);

    // Event handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setMessage("Hanya file PDF yang diizinkan");
                return;
            }

            if (selectedFile.size > 5 * 1024 * 1024) {
                setMessage("Ukuran file tidak boleh lebih dari 5MB");
                return;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);
            setMessage("");
            setPdfError(false);

            // I-revoke ang lumang URL bago gumawa ng bago
            if (pdfPreviewUrl) {
                URL.revokeObjectURL(pdfPreviewUrl);
            }
            const objectUrl = URL.createObjectURL(selectedFile);
            setPdfPreviewUrl(objectUrl);

            // Ito ang bagong linya ng code
            setShowPdfPreview(true);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName("");
        if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }
        setPdfPreviewUrl("");
        setPdfError(false);
        setCurrentPage(1);
        setTotalPages(1);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePreviewPdf = () => {
        if (file || pdfPreviewUrl) {
            setShowPdfPreview(true);
            setCurrentPage(1);
            setPdfError(false);
        } else {
            setMessage("Silakan lampirkan file PDF terlebih dahulu.");
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setTotalPages(numPages);
        setPdfLoading(false);
    };

    const onDocumentLoadError = (error) => {
        console.error("Error loading PDF:", error);
        setPdfError(true);
        setPdfLoading(false);
    };

    const submitForm = async () => {
        setIsSubmitting(true);
        setMessage("");

        try {
            let payload;

            if (isEditing) {
                // Edit mode: Create a FormData object only if a new file is selected
                if (file) {
                    payload = new FormData();
                    payload.append("title", formData.title);
                    payload.append("description", formData.description);
                    payload.append("file", file);
                } else {
                    // If no new file, send a plain JSON object
                    payload = {
                        title: formData.title,
                        description: formData.description,
                    };
                }
            } else {
                // Create mode: File is required
                if (!file) {
                    setMessage("File is required when creating a proposal.");
                    setIsSubmitting(false);
                    return;
                }
                payload = new FormData();
                payload.append("title", formData.title);
                payload.append("description", formData.description);
                payload.append("file", file);
            }

            await onSubmit(payload, isEditing);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage(`Terjadi kesalahan saat ${isEditing ? "memperbarui" : "mengirim"} proposal`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm();
    };

    const confirmSubmit = () => {
        setShowPdfPreview(false);
        submitForm();
    };

    useEffect(() => {
        return () => {
            if (pdfPreviewUrl) {
                URL.revokeObjectURL(pdfPreviewUrl);
            }
        };
    }, [pdfPreviewUrl]);

    // Reset preview state when modal closes
    useEffect(() => {
        if (!showPdfPreview) {
            setCurrentPage(1);
            setScale(1.0);
            setRotation(0);
            setPdfError(false);
        }
    }, [showPdfPreview]);

    if (!isOpen) return null;

    const modalTitle = isEditing ? "Edit Proposal" : "Proposal Submission Form";
    const submitButtonText = isEditing ? "Save Changes" : "Submit Proposal";
    const previewButtonText = isEditing ? "Preview & Update" : "Preview & Submit";

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">{modalTitle}</h1>
                        <p className="text-sm text-gray-600 sm:text-base">Fill out the details for your project proposal.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Title input */}
                        <div className="mb-6">
                            <label className="mb-2 block flex items-center text-sm font-semibold text-gray-700">
                                <FileText className="mr-2 h-4 w-4 text-pink-500" />
                                Proposal Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Q3 Marketing Strategy"
                                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Description textarea */}
                        <div className="mb-6">
                            <label className="mb-2 block flex items-center text-sm font-semibold text-gray-700">
                                <MessageSquareText className="mr-2 h-4 w-4 text-pink-500" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Provide a detailed description of the proposal."
                                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            ></textarea>
                        </div>

                        {/* File input (only for new submissions) */}
                        {!isEditing && (
                            <div className="mb-6">
                                <label className="mb-2 block flex items-center text-sm font-semibold text-gray-700">
                                    <Paperclip className="mr-2 h-4 w-4 text-pink-500" />
                                    Attach PDF File
                                </label>
                                {fileName ? (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-800 transition-colors">
                                            <span
                                                className="max-w-xs truncate"
                                                title={fileName}
                                            >
                                                {fileName}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handlePreviewPdf}
                                                    className="p-1 text-blue-500 transition-colors hover:text-blue-700"
                                                    title="Preview PDF"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFile}
                                                    className="p-1 text-red-500 transition-colors hover:text-red-700"
                                                    title="Remove file"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">Hanya file PDF yang diterima. Maksimal ukuran: 5MB</p>
                                    </div>
                                ) : (
                                    <label className="flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-100 px-4 py-6 text-gray-600 transition-colors hover:bg-gray-200">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            ref={fileInputRef}
                                            accept=".pdf,application/pdf"
                                            required={!isEditing}
                                        />
                                        <Paperclip className="mb-2 h-8 w-8 text-gray-500" />
                                        <span className="text-center text-sm font-medium">Click to select a PDF file</span>
                                        <span className="mt-1 text-xs text-gray-500">Format: PDF, Maksimal: 5MB</span>
                                    </label>
                                )}
                            </div>
                        )}

                        {/* Error message */}
                        {message && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                                <p className="text-sm font-medium">{message}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-bold text-gray-700 transition duration-300 ease-in-out hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || (file && file.type !== "application/pdf") || (!isEditing && !file)}
                                className="flex-1 transform rounded-lg bg-gradient-to-br from-pink-600 to-blue-600 px-4 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-pink-700 hover:to-blue-700 disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                {isSubmitting ? "Submitting..." : file || initialFileUrl ? previewButtonText : submitButtonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* PDF Preview Modal */}
            {showPdfPreview && (file || pdfPreviewUrl) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4">
                    <div className="flex max-h-[95vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between rounded-t-2xl border-b bg-gray-50 p-4">
                            <h2 className="truncate text-xl font-semibold text-gray-800">PDF Preview - {fileName}</h2>
                            <div className="flex items-center gap-2">
                                <a
                                    href={pdfPreviewUrl}
                                    download={fileName}
                                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                                    title="Download PDF"
                                >
                                    <Download className="h-5 w-5" />
                                </a>
                                <button
                                    onClick={() => setShowPdfPreview(false)}
                                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-gray-100 p-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
                                    className="rounded-lg border bg-white p-2 transition-colors hover:bg-gray-50"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </button>
                                <span className="px-2 text-sm font-medium">{(scale * 100).toFixed(0)}%</span>
                                <button
                                    onClick={() => setScale((prev) => Math.min(3, prev + 0.2))}
                                    className="rounded-lg border bg-white p-2 transition-colors hover:bg-gray-50"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                    className="ml-2 rounded-lg border bg-white p-2 transition-colors hover:bg-gray-50"
                                    title="Rotate"
                                >
                                    <RotateCw className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setScale(1.0);
                                        setRotation(0);
                                    }}
                                    className="rounded-lg border bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                                    title="Reset View"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage <= 1}
                                    className="rounded-lg border bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-sm">
                                    Page{" "}
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={currentPage}
                                        onChange={(e) => {
                                            const page = parseInt(e.target.value) || 1;
                                            setCurrentPage(Math.min(Math.max(1, page), totalPages));
                                        }}
                                        className="mx-1 w-12 rounded border px-1 text-center"
                                    />{" "}
                                    of <span className="font-medium">{totalPages}</span>
                                </span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="rounded-lg border bg-white p-2 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* PDF Display Area */}
                        <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-600 p-4">
                            {pdfError ? (
                                <div className="text-center text-white">
                                    <div className="mb-4">
                                        <FileText className="mx-auto h-16 w-16 opacity-50" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">Cannot preview PDF</h3>
                                    <p className="mb-4 text-gray-300">
                                        PDF preview is not available. You can still download the file.
                                    </p>
                                    <a
                                        href={pdfPreviewUrl}
                                        download={fileName}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download PDF
                                    </a>
                                </div>
                            ) : (
                                <div
                                    className="bg-white shadow-2xl transition-transform duration-300 ease-out"
                                    style={{
                                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                                        transformOrigin: "center center",
                                    }}
                                >
                                    <Document
                                        file={pdfPreviewUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        loading={<div className="p-8 text-center text-gray-600">Loading PDF...</div>}
                                        className="max-h-[70vh] overflow-auto"
                                    >
                                        <Page 
                                            pageNumber={currentPage} 
                                            scale={scale}
                                            rotate={rotation}
                                            className="rounded-lg"
                                        />
                                    </Document>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col justify-between gap-3 rounded-b-2xl border-t bg-gray-50 p-4 sm:flex-row">
                            <button
                                onClick={() => setShowPdfPreview(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                Close Preview
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPdfPreview(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    Edit Proposal
                                </button>
                                <button
                                    onClick={confirmSubmit}
                                    disabled={isSubmitting}
                                    className="rounded-lg bg-gradient-to-r from-pink-600 to-blue-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:from-pink-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    {isSubmitting ? "Submitting..." : "Confirm Submission"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddFormModal;