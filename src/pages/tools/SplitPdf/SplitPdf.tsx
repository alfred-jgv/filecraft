import { useState, useCallback } from "react";
import { Upload, FileText, Scissors, Loader2, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "../../Dashboard.module.css";
import dropStyles from "./SplitPdf.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function SplitPdf() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [splitMode, setSplitMode] = useState<"pages" | "ranges">("pages");
    const [previewMode, setPreviewMode] = useState<"input" | "output">("input");
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [, setIsDocLoading] = useState(false);
    const [docError, setDocError] = useState<string | null>(null);
    const [extractedPages, setExtractedPages] = useState<number[]>([]);
    const [pageInput, setPageInput] = useState("");
    const [rangeInput, setRangeInput] = useState("");

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
            setPageNumber(1);
            setExtractedPages([]);
            setDocError(null);
        } else {
            alert("Please drop a valid PDF file");
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setPageNumber(1);
            setExtractedPages([]);
            setDocError(null);
        } else if (selectedFile) {
            alert("Please select a valid PDF file");
        }
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsDocLoading(false);
        setDocError(null);
    };

    const onDocumentLoadError = (error: Error) => {
        setIsDocLoading(false);
        setDocError("Failed to load PDF. Please try another file.");
        console.error("PDF load error:", error);
    };

    const handleSplit = async () => {
        if (!file) return;
        setIsProcessing(true);
        let pagesToExtract: number[] = [];
        if (splitMode === "pages") {
            pagesToExtract = parsePageInput(pageInput, numPages);
        } else {
            pagesToExtract = parseRangeInput(rangeInput, numPages);
        }
        setExtractedPages(pagesToExtract);
        setTimeout(() => {
            setIsProcessing(false);
            setPreviewMode("output");
        }, 2000);
    };

    const parsePageInput = (input: string, totalPages: number): number[] => {
        if (!input) return [];
        const pages = new Set<number>();
        const parts = input.split(",");
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.includes("-")) {
                const [start, end] = trimmed.split("-").map(Number);
                for (let i = start; i <= end && i <= totalPages; i++) {
                    if (i >= 1) pages.add(i);
                }
            } else {
                const page = Number(trimmed);
                if (page >= 1 && page <= totalPages) pages.add(page);
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    };

    const parseRangeInput = (input: string, totalPages: number): number[] => {
        if (!input) return [];
        const ranges: number[] = [];
        const parts = input.split(",");
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.includes("-")) {
                const [start] = trimmed.split("-").map(Number);
                if (start >= 1 && start <= totalPages) ranges.push(start);
            }
        }
        return ranges;
    };

    const handleRemoveFile = () => {
        setFile(null);
        setNumPages(0);
        setExtractedPages([]);
        setPageInput("");
        setRangeInput("");
        setDocError(null);
    };

    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Split PDF</h1>
                <p className={styles.subtitle}>Extract pages or divide a PDF into separate files</p>
            </div>

            <div className={dropStyles.splitLayout}>
                <div className={dropStyles.leftPanel}>
                    {!file ? (
                        <div
                            className={`${dropStyles.dropzone} ${isDragging ? dropStyles.dragging : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("file-input")?.click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                            />
                            <div className={dropStyles.dropzoneContent}>
                                <div className={dropStyles.iconWrapper}>
                                    <Upload size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className={dropStyles.dropzoneTitle}>Drop your PDF here</h3>
                                <p className={dropStyles.dropzoneText}>
                                    or <span className={dropStyles.browseLink}>browse files</span>
                                </p>
                                <p className={dropStyles.fileHint}>Supported format: PDF</p>
                            </div>
                        </div>
                    ) : (
                        <div className={dropStyles.fileCard}>
                            <div className={dropStyles.fileInfo}>
                                <div className={dropStyles.fileIcon}>
                                    <FileText size={32} strokeWidth={1.5} />
                                </div>
                                <div className={dropStyles.fileDetails}>
                                    <h3 className={dropStyles.fileName}>{file.name}</h3>
                                    <p className={dropStyles.fileSize}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {numPages || "..."} pages
                                    </p>
                                </div>
                                <button className={dropStyles.removeButton} onClick={handleRemoveFile} aria-label="Remove file">
                                    ×
                                </button>
                            </div>

                            <div className={dropStyles.splitOptions}>
                                <div className={dropStyles.modeToggle}>
                                    <button
                                        className={`${dropStyles.modeButton} ${splitMode === "pages" ? dropStyles.active : ""}`}
                                        onClick={() => setSplitMode("pages")}
                                    >
                                        Split by pages
                                    </button>
                                    <button
                                        className={`${dropStyles.modeButton} ${splitMode === "ranges" ? dropStyles.active : ""}`}
                                        onClick={() => setSplitMode("ranges")}
                                    >
                                        Split by ranges
                                    </button>
                                </div>

                                {splitMode === "pages" ? (
                                    <div className={dropStyles.inputGroup}>
                                        <label className={dropStyles.label}>
                                            Extract specific pages
                                            <span className={dropStyles.hint}>(e.g., 1,3,5-7)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={dropStyles.input}
                                            placeholder="1,3,5-7,10"
                                            value={pageInput}
                                            onChange={(e) => setPageInput(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className={dropStyles.inputGroup}>
                                        <label className={dropStyles.label}>
                                            Split into ranges
                                            <span className={dropStyles.hint}>(e.g., 1-5,6-10,11-15)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={dropStyles.input}
                                            placeholder="1-5,6-10,11-15"
                                            value={rangeInput}
                                            onChange={(e) => setRangeInput(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className={dropStyles.inputGroup}>
                                    <label className={dropStyles.label}>
                                        Output filename pattern
                                        <span className={dropStyles.hint}>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={dropStyles.input}
                                        placeholder="output_{page}.pdf"
                                        defaultValue="split_{page}.pdf"
                                    />
                                </div>
                            </div>

                            <div className={dropStyles.actions}>
                                <button
                                    className={dropStyles.splitButton}
                                    onClick={handleSplit}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={18} strokeWidth={1.5} className={dropStyles.spinning} />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Scissors size={18} strokeWidth={1.5} />
                                            Split PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={dropStyles.rightPanel}>
                    <div className={dropStyles.previewHeader}>
                        <div className={dropStyles.previewTabs}>
                            <button
                                className={`${dropStyles.previewTab} ${previewMode === "input" ? dropStyles.active : ""}`}
                                onClick={() => setPreviewMode("input")}
                                disabled={!file}
                            >
                                <Eye size={16} strokeWidth={1.5} />
                                Input Preview
                            </button>
                            <button
                                className={`${dropStyles.previewTab} ${previewMode === "output" ? dropStyles.active : ""}`}
                                onClick={() => setPreviewMode("output")}
                                disabled={extractedPages.length === 0}
                            >
                                <Download size={16} strokeWidth={1.5} />
                                Output Preview ({extractedPages.length})
                            </button>
                        </div>
                        {file && previewMode === "input" && numPages > 0 && (
                            <div className={dropStyles.pageControls}>
                                <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span className={dropStyles.pageInfo}>
                                    {pageNumber} / {numPages}
                                </span>
                                <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={dropStyles.previewContent}>
                        {!file ? (
                            <div className={dropStyles.emptyPreview}>
                                <FileText size={64} strokeWidth={1} />
                                <p>Upload a PDF to see preview</p>
                            </div>
                        ) : previewMode === "input" ? (
                            <div className={dropStyles.singlePagePreview}>
                                {docError ? (
                                    <div className={dropStyles.emptyPreview}>
                                        <p style={{ color: "#c0392b" }}>{docError}</p>
                                    </div>
                                ) : (
                                    <Document
                                        file={file}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        onLoadStart={() => setIsDocLoading(true)}
                                        loading={
                                            <div className={dropStyles.loadingPreview}>
                                                <Loader2 size={32} className={dropStyles.spinning} />
                                                <p>Loading PDF...</p>
                                            </div>
                                        }
                                        error={
                                            <div className={dropStyles.emptyPreview}>
                                                <p style={{ color: "#c0392b" }}>Failed to load PDF.</p>
                                            </div>
                                        }
                                    >
                                        <Page
                                            pageNumber={pageNumber}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            width={340}
                                            className={dropStyles.pdfPage}
                                        />
                                    </Document>
                                )}
                            </div>
                        ) : (
                            <div className={dropStyles.pageGrid}>
                                {extractedPages.map((pageNum, idx) => (
                                    <div key={idx} className={`${dropStyles.pageCard} ${dropStyles.outputCard}`}>
                                        <div className={dropStyles.pageNumber}>Output {idx + 1}</div>
                                        <div className={dropStyles.miniPreview}>
                                            <Document
                                                file={file}
                                                loading={<Loader2 size={20} className={dropStyles.spinning} />}
                                            >
                                                <Page
                                                    pageNumber={pageNum}
                                                    width={100}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                />
                                            </Document>
                                        </div>
                                        <div className={dropStyles.pageLabel}>Page {pageNum}</div>
                                        <button className={dropStyles.downloadBtn}>
                                            <Download size={14} strokeWidth={1.5} />
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}