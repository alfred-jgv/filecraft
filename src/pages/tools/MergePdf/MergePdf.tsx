import { useState, useCallback } from "react";
import { Upload, FileText, Merge, Loader2, X, GripVertical, ArrowDown } from "lucide-react";
import styles from "../../Dashboard.module.css";
import mergeStyles from "./Merge.module.css";

export default function MergePdf() {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);

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
        const validFiles = droppedFiles.filter(f => f.type === "application/pdf");
        
        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
        } else {
            alert("Please drop valid PDF files");
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);
    }, []);

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOverItem = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIndex === null) return;
        
        const draggedItem = files[dragIndex];
        const targetItem = files[index];
        
        if (draggedItem !== targetItem) {
            const newFiles = [...files];
            newFiles.splice(dragIndex, 1);
            newFiles.splice(index, 0, draggedItem);
            setFiles(newFiles);
            setDragIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDragIndex(null);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            alert("Please select at least 2 PDF files to merge");
            return;
        }
        
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            alert(`Merging ${files.length} PDF files into one document...`);
        }, 2000);
    };

    const handleClearAll = () => {
        setFiles([]);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Merge PDFs</h1>
                <p className={styles.subtitle}>
                    Combine multiple PDF files into one document
                </p>
            </div>

            <div className={mergeStyles.mergeLayout}>
                {files.length === 0 ? (
                    <div
                        className={`${mergeStyles.dropzone} ${isDragging ? mergeStyles.dragging : ""}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("merge-file-input")?.click()}
                    >
                        <input
                            id="merge-file-input"
                            type="file"
                            accept=".pdf"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                        <div className={mergeStyles.dropzoneContent}>
                            <div className={mergeStyles.iconWrapper}>
                                <Upload size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className={mergeStyles.dropzoneTitle}>Drop PDFs here</h3>
                            <p className={mergeStyles.dropzoneText}>
                                or <span className={mergeStyles.browseLink}>browse files</span>
                            </p>
                            <p className={mergeStyles.fileHint}>
                                Select multiple PDF files to merge
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className={mergeStyles.mergeContainer}>
                        <div className={mergeStyles.mergeHeader}>
                            <h3 className={mergeStyles.mergeTitle}>
                                {files.length} file(s) to merge
                            </h3>
                            <div className={mergeStyles.mergeActions}>
                                <button 
                                    className={mergeStyles.clearButton}
                                    onClick={handleClearAll}
                                >
                                    Clear all
                                </button>
                                <label className={mergeStyles.addMoreButton}>
                                    <Upload size={16} strokeWidth={1.5} />
                                    Add more
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        multiple
                                        onChange={handleFileSelect}
                                        style={{ display: "none" }}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className={mergeStyles.fileOrderList}>
                            <p className={mergeStyles.orderHint}>
                                <GripVertical size={14} />
                                Drag to reorder files
                            </p>
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className={`${mergeStyles.orderItem} ${dragIndex === index ? mergeStyles.dragging : ""}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOverItem(e, index)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <GripVertical size={18} className={mergeStyles.dragHandle} />
                                    <div className={mergeStyles.orderNumber}>{index + 1}</div>
                                    <FileText size={20} strokeWidth={1.5} />
                                    <div className={mergeStyles.orderItemInfo}>
                                        <span className={mergeStyles.orderItemName}>{file.name}</span>
                                        <span className={mergeStyles.orderItemSize}>
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                    <button 
                                        className={mergeStyles.removeOrderBtn}
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {files.length > 1 && (
                            <div className={mergeStyles.previewInfo}>
                                <ArrowDown size={20} strokeWidth={1.5} />
                                <p>Files will be merged in this order</p>
                                <ArrowDown size={20} strokeWidth={1.5} />
                            </div>
                        )}

                        <div className={mergeStyles.mergeFooter}>
                            <button 
                                className={mergeStyles.mergeButton}
                                onClick={handleMerge}
                                disabled={isProcessing || files.length < 2}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={18} className={mergeStyles.spinning} />
                                        Merging...
                                    </>
                                ) : (
                                    <>
                                        <Merge size={18} />
                                        Merge {files.length} files
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}