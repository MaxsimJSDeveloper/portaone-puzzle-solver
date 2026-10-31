import { useState } from "react";

interface SolutionCardProps {
  solution: string;
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-200">
            Optimal Sequence Found
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
            Length: {solution.length} chars
          </span>
          <button
            onClick={copyToClipboard}
            className="text-xs font-medium px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/30 transition-colors cursor-pointer"
          >
            {copied ? "Copied!" : "Copy Result"}
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm leading-relaxed break-all text-emerald-400 selection:bg-emerald-500/30">
        {solution}
      </div>
    </section>
  );
}