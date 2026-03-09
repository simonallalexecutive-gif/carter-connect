import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText } from 'lucide-react';

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

const FileDropzone = ({
  file,
  onFileChange,
  accept = '.pdf,.doc,.docx',
  maxSizeMB = 10,
  label = 'Déposez votre CV ici',
  className,
}: FileDropzoneProps) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.size <= maxSizeMB * 1024 * 1024) {
      onFileChange(dropped);
    }
  }, [onFileChange, maxSizeMB]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.size <= maxSizeMB * 1024 * 1024) {
      onFileChange(selected);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors hover:border-primary/40 cursor-pointer",
        className
      )}
    >
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-5 h-5 text-carter-accent" />
          <span className="font-sans text-sm text-foreground">{file.name}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
            className="p-1 rounded-full hover:bg-muted"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer block">
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="font-sans text-sm text-muted-foreground">{label}</p>
          <p className="font-sans text-xs text-text-soft mt-1">PDF, DOC, DOCX · Max {maxSizeMB}MB</p>
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default FileDropzone;
