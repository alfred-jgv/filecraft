import { useState, useCallback } from "react";
import { 
    Upload, FileText, RefreshCw, Loader2, 
    FileImage, ChevronDown, Download, X 
} from "lucide-react";
import styles from "../../Dashboard.module.css";
import convertStyles from "./Convert.module.css";

type ConvertFormat = "pdf-to-word" | "pdf-to-jpg" | "pdf-to-png" | "word-to-pdf" | "jpg-to-pdf" | "png-to-pdf";

const CONVERSIONS = [
    { id: "pdf-to-word", label: "PDF → Word", from: "PDF", to: "Word", icon: FileText },
    { id: "pdf-to-jpg", label: "PDF → JPG", from: "PDF", to: "JPG", icon: FileImage },
    { id: "pdf-to-png", label: "PDF → PNG", from: "PDF", to: "PNG", icon: FileImage },
    { id: "word-to-pdf", label: "Word → PDF", from: "Word", to: "PDF", icon: FileText },
    { id: "jpg-to-pdf", label: "JPG → PDF", from: "JPG", to: "PDF", icon: FileImage },
    { id: "png-to-pdf", label: "PNG → PDF", from: "PNG", to: "PDF", icon: FileImage },
];

export default function Convert() {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedConversion, setSelectedConversion] = useState<ConvertFormat>("pdf-to-word");
    const [showDropdown, setShowDropdown] = useState(false);
    const [convertedFiles, setConvertedFiles] = useState<{ name: string; size: string }[]>([]);

    const currentConversion = CONVERSIONS.find(c => c.id === selectedConversion)!;

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
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(f => 
            f.type === "application/pdf" || 
            f.type === "application/msword" ||
            f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            f.type.startsWith("image/")
        );
        
        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
        } else {
            alert("Please drop valid files (PDF, Word, or images)");
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);
    }, []);

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (files.length === 0) return;
        
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setConvertedFiles([
                { name: `converted_1.${currentConversion.to.toLowerCase()}`, size: "245 KB" },
                { name: `converted_2.${currentConversion.to.toLowerCase()}`, size: "189 KB" },
            ]);
            alert(`Converting ${files.length} file(s) to ${currentConversion.to}...`);
        }, 2000);
    };

    const handleDownloadAll = () => {
        alert("Downloading all converted files...");
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Convert Files</h1>
                <p className={styles.subtitle}>
                    Transform between PDF, Word, JPG, PNG and more
                </p>
            </div>

            <div className={convertStyles.convertLayout}>
                <div className={convertStyles.conversionSelector}>
                    <label className={convertStyles.label}>Convert from → to</label>
                    <div className={convertStyles.dropdownWrapper}>
                        <button 
                            className={convertStyles.dropdownButton}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <currentConversion.icon size={18} strokeWidth={1.5} />
                            <span>{currentConversion.label}</span>
                            <ChevronDown size={16} strokeWidth={1.5} />
                        </button>
                        {showDropdown && (
                            <div className={convertStyles.dropdownMenu}>
                                {CONVERSIONS.map(conv => (
                                    <button
                                        key={conv.id}
                                        className={convertStyles.dropdownItem}
                                        onClick={() => {
                                            setSelectedConversion(conv.id as ConvertFormat);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <conv.icon size={16} strokeWidth={1.5} />
                                        <span>{conv.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`${convertStyles.dropzone} ${isDragging ? convertStyles.dragging : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("convert-file-input")?.click()}
                >
                    <input
                        id="convert-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: "none" }}
                    />
                    <div className={convertStyles.dropzoneContent}>
                        <div className={convertStyles.iconWrapper}>
                            <Upload size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className={convertStyles.dropzoneTitle}>Drop files here</h3>
                        <p className={convertStyles.dropzoneText}>
                            or <span className={convertStyles.browseLink}>browse files</span>
                        </p>
                        <p className={convertStyles.fileHint}>
                            Supports PDF, Word, JPG, PNG (max 10 files)
                        </p>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className={convertStyles.fileList}>
                        <h4 className={convertStyles.fileListTitle}>
                            {files.length} file(s) selected
                        </h4>
                        {files.map((file, index) => (
                            <div key={index} className={convertStyles.fileItem}>
                                <FileText size={20} strokeWidth={1.5} />
                                <div className={convertStyles.fileItemInfo}>
                                    <span className={convertStyles.fileItemName}>{file.name}</span>
                                    <span className={convertStyles.fileItemSize}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                                <button 
                                    className={convertStyles.removeFileBtn}
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        
                        <div className={convertStyles.convertActions}>
                            <button 
                                className={convertStyles.convertButton}
                                onClick={handleConvert}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={18} className={convertStyles.spinning} />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={18} />
                                        Convert to {currentConversion.to}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {convertedFiles.length > 0 && (
                    <div className={convertStyles.results}>
                        <h4 className={convertStyles.resultsTitle}>Converted files</h4>
                        <div className={convertStyles.resultsGrid}>
                            {convertedFiles.map((file, index) => (
                                <div key={index} className={convertStyles.resultCard}>
                                    <Download size={24} strokeWidth={1.5} />
                                    <div className={convertStyles.resultInfo}>
                                        <span className={convertStyles.resultName}>{file.name}</span>
                                        <span className={convertStyles.resultSize}>{file.size}</span>
                                    </div>
                                    <button className={convertStyles.downloadBtn}>
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className={convertStyles.downloadAllBtn} onClick={handleDownloadAll}>
                            <Download size={16} strokeWidth={1.5} />
                            Download All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}