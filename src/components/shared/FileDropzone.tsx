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
  label = 'Déposez votre fichier ici',
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
        "border border-dashed border-border rounded-sm p-8 text-center transition-colors duration-300 hover:border-accent/40 cursor-pointer",
        className
      )}
    >
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-4 h-4 text-accent" />
          <span className="font-sans text-sm text-foreground font-light">{file.name}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
            className="p-1 rounded-sm hover:bg-secondary"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer block">
          <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-3" />
          <p className="font-sans text-sm text-muted-foreground font-light">{label}</p>
          <p className="font-sans text-xs text-muted-foreground/60 mt-1">PDF, DOC, DOCX · Max {maxSizeMB}MB</p>
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
