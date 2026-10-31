import { type ChangeEvent, useRef } from "react";

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
      // Скидаємо значення інпута, щоб можна було повторно завантажувати один і той самий файл
      e.target.value = "";
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          PortaOne Puzzle Solver
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Sequence Reconstruction Algorithm • {fragmentsCount} fragments loaded
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Прихований файл інпут */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isSolving}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all disabled:opacity-50 cursor-pointer"
        >
          Upload TXT
        </button>

        <button
          onClick={onSolve}
          disabled={isSolving || fragmentsCount === 0}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isSolving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Graph...</span>
            </>
          ) : (
            <span>Solve Puzzle</span>
          )}
        </button>
      </div>
    </header>
  );
}