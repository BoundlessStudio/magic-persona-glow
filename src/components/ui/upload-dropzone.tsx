import { forwardRef } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  accept?: Record<string, string[]>;
  description?: {
    maxFiles?: number;
    maxFileSize?: string;
    fileTypes?: string;
  };
  onDrop?: (files: File[]) => void;
  className?: string;
}

export const UploadDropzone = forwardRef<HTMLDivElement, UploadDropzoneProps>(
  ({ accept, description, onDrop, className }, ref) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept,
      maxFiles: description?.maxFiles,
      onDrop: (acceptedFiles) => onDrop?.(acceptedFiles),
    });

    return (
      <div
        {...getRootProps()}
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-10 transition-colors cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="rounded-full border border-dashed border-muted-foreground/25 p-4">
          <Upload className="size-7 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description.maxFiles && `You can upload ${description.maxFiles} files`}
              {description.maxFileSize && `. Each up to ${description.maxFileSize}`}
              {description.fileTypes && `. Accepted ${description.fileTypes}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

UploadDropzone.displayName = "UploadDropzone";

