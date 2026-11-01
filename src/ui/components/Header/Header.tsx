import { useRef, type ChangeEvent } from "react";
import { Upload, Play } from "lucide-react";
import { Button, Heading } from "@/ui/shared";

interface HeaderProps {
  fragmentsCount: number;
  isSolving: boolean;
  onSolve: () => void;
  onFileUpload: (file: File) => void;
}

export function Header({
  fragmentsCount,
  isSolving,
  onSolve,
  onFileUpload,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = "";
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
      <div>
        <Heading level={1} className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          PortaOne Puzzle Solver
        </Heading>
        <p className="text-slate-400 text-sm mt-1">
          Sequence Reconstruction Algorithm • <span className="font-mono text-indigo-400">{fragmentsCount}</span> fragments loaded
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="secondary"
          disabled={isSolving}
          onClick={() => fileInputRef.current?.click()}
          icon={<Upload size={16} />}
        >
          Upload TXT
        </Button>

        <Button
          variant="primary"
          isLoading={isSolving}
          disabled={fragmentsCount === 0}
          onClick={onSolve}
          icon={<Play size={16} />}
        >
          {isSolving ? "Analyzing Graph..." : "Solve Puzzle"}
        </Button>
      </div>
    </header>
  );
}