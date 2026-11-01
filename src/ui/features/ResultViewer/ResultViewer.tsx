import { useState } from "react";
import { Copy, Check, Hash, Clock, AlertTriangle, Layers } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, Heading, Button } from "@/ui/shared";
import type { ISolverResult } from "@/core/types";

interface ResultViewerProps {
  result: ISolverResult;
  executionTimeMs: number;
}

export function ResultViewer({ result, executionTimeMs }: ResultViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result.sequence) return;
    navigator.clipboard.writeText(result.sequence);
    setCopied(true);
    toast.success("Sequence copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-indigo-500/30">
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <Heading level={2}>Optimal Sequence Solution</Heading>
          </div>

          <Button
            variant="outline"
            onClick={handleCopy}
            icon={copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          >
            {copied ? "Copied!" : "Copy Result"}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Clock size={14} className="text-indigo-400" />
              <span>Time</span>
            </div>
            <p className="text-lg font-bold font-mono text-slate-100">{executionTimeMs.toFixed(2)} ms</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Hash size={14} className="text-emerald-400" />
              <span>Length</span>
            </div>
            <p className="text-lg font-bold font-mono text-slate-100">{result.sequence.length} chars</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Layers size={14} className="text-blue-400" />
              <span>Used Pieces</span>
            </div>
            <p className="text-lg font-bold font-mono text-slate-100">{result.usedCount}</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <AlertTriangle size={14} className="text-rose-400" />
              <span>Rejected</span>
            </div>
            <p className="text-lg font-bold font-mono text-slate-100">{result.rejectedCount}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Reconstructed Sequence Output
          </label>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm leading-relaxed break-all text-emerald-400 max-h-60 overflow-y-auto selection:bg-emerald-500/30">
            {result.sequence || "No valid sequence reconstructed."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}