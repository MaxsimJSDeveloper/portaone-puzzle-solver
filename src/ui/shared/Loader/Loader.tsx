import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export function Loader({ size = 32, text = "Loading...", className = "" }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-8 text-slate-400 ${className}`}>
      <Loader2 size={size} className="animate-spin text-indigo-500" />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
}