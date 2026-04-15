import { useState, useCallback } from "react";
import { FileText, FileJson, Loader2, Download, Settings, X, ChevronDown } from "lucide-react";
import styles from "../../Dashboard.module.css";
import pdfToWordStyles from "./PdfToWord.module.css";

export default function PdfToWord() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [options, setOptions] = useState({
        preserveFormatting: true,
        extractImages: false,
        ocrEnabled: true,
    });

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
        } else {
            alert("Please drop a valid PDF file");
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else if (selectedFile) {
            alert("Please select a valid PDF file");
        }
    }, []);

    const handleConvert = async () => {
        if (!file) return;
        
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            alert(`Converting "${file.name}" to Word document...`);
        }, 3000);
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>PDF to Word</h1>
                <p className={styles.subtitle}>
                    Convert any PDF into an editable Word document
                </p>
            </div>

            <div className={pdfToWordStyles.convertLayout}>
                {!file ? (
                    <div
                        className={`${pdfToWordStyles.dropzone} ${isDragging ? pdfToWordStyles.dragging : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("pdf-word-input")?.click()}
                    >
                        <input
                            id="pdf-word-input"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                        <div className={pdfToWordStyles.dropzoneContent}>
                            <div className={pdfToWordStyles.iconWrapper}>
                                <FileJson size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className={pdfToWordStyles.dropzoneTitle}>Drop your PDF here</h3>
                            <p className={pdfToWordStyles.dropzoneText}>
                                or <span className={pdfToWordStyles.browseLink}>browse files</span>
                            </p>
                            <p className={pdfToWordStyles.fileHint}>
                                Convert to editable Word (.docx) format
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className={pdfToWordStyles.conversionCard}>
                        <div className={pdfToWordStyles.filePreview}>
                            <div className={pdfToWordStyles.previewIcon}>
                                <FileText size={48} strokeWidth={1.5} />
                            </div>
                            <div className={pdfToWordStyles.previewInfo}>
                                <h3 className={pdfToWordStyles.previewName}>{file.name}</h3>
                                <p className={pdfToWordStyles.previewSize}>
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button 
                                className={pdfToWordStyles.removePreviewBtn}
                                onClick={handleRemoveFile}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={pdfToWordStyles.optionsSection}>
                            <button 
                                className={pdfToWordStyles.optionsToggle}
                                onClick={() => setShowOptions(!showOptions)}
                            >
                                <Settings size={16} strokeWidth={1.5} />
                                Conversion Options
                                <ChevronDown size={16} className={showOptions ? pdfToWordStyles.rotated : ""} />
                            </button>
                            
                            {showOptions && (
                                <div className={pdfToWordStyles.optionsPanel}>
                                    <label className={pdfToWordStyles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={options.preserveFormatting}
                                            onChange={(e) => setOptions({ ...options, preserveFormatting: e.target.checked })}
                                        />
                                        <span>Preserve original formatting</span>
                                    </label>
                                    <label className={pdfToWordStyles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={options.extractImages}
                                            onChange={(e) => setOptions({ ...options, extractImages: e.target.checked })}
                                        />
                                        <span>Extract images separately</span>
                                    </label>
                                    <label className={pdfToWordStyles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={options.ocrEnabled}
                                            onChange={(e) => setOptions({ ...options, ocrEnabled: e.target.checked })}
                                        />
                                        <span>Enable OCR for scanned PDFs</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className={pdfToWordStyles.conversionActions}>
                            <button 
                                className={pdfToWordStyles.convertBtn}
                                onClick={handleConvert}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={18} className={pdfToWordStyles.spinning} />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        Convert to Word
                                    </>
                                )}
                            </button>
                        </div>

                        <div className={pdfToWordStyles.conversionNote}>
                            <p>✓ High-quality conversion</p>
                            <p>✓ Editable text and formatting</p>
                            <p>✓ Works with scanned PDFs</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}