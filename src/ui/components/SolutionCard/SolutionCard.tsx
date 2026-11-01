import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, Heading, Button } from "@/ui/shared";

interface SolutionCardProps {
  solution: string;
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    toast.success("Result copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-indigo-500/30">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <Heading level={2}>Optimal Sequence Found</Heading>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 bg-slate-950 text-slate-300 rounded-full border border-slate-800">
              Length: {solution.length} chars
            </span>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              icon={copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            >
              {copied ? "Copied!" : "Copy Result"}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm leading-relaxed break-all text-emerald-400 selection:bg-emerald-500/30 h-64 overflow-y-auto">
          {solution}
        </div>
      </CardContent>
    </Card>
  );
}