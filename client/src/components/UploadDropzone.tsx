import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadDataset } from "@/hooks/use-datasets";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDataset();
  const [, setLocation] = useLocation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert("Please upload a CSV file");
      return;
    }
    
    setFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const result = await uploadMutation.mutateAsync(formData);
      // Navigate to dashboard with the new dataset ID
      setLocation(`/dashboard/${result.id}`);
    } catch (error) {
      setFileName(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  };

  return (
    <div 
      className={cn(
        "relative group cursor-pointer w-full max-w-2xl mx-auto rounded-3xl border-2 border-dashed transition-all duration-300 ease-out",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.01]" 
          : "border-border hover:border-primary/50 hover:bg-muted/30",
        uploadMutation.isPending && "opacity-80 pointer-events-none"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept=".csv"
        onChange={handleFileSelect}
      />
      
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className={cn(
          "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
          isDragging ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}>
          {uploadMutation.isPending ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-semibold text-foreground">
            {uploadMutation.isPending ? "Processing Dataset..." : "Upload Equipment Data"}
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {fileName 
              ? `Processing: ${fileName}`
              : "Drag & drop your CSV file here, or click to browse. Supports standard equipment logs."}
          </p>
        </div>

        {uploadMutation.isError && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-lg mt-4 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Upload failed. Please check format.</span>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <FileSpreadsheet className="w-3 h-3" />
          <span>Accepts .csv files only</span>
        </div>
      </div>
    </div>
  );
}
