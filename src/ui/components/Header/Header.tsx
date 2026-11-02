import { Heading } from "@/ui/shared";

interface HeaderProps {
  fragmentsCount: number;
}

export function Header({ fragmentsCount }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        <Heading level={1} className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          PortaOne Puzzle Solver
        </Heading>
        <p className="text-slate-400 text-sm mt-1">
          Sequence Reconstruction Algorithm • <span className="font-mono text-indigo-400">{fragmentsCount}</span> fragments loaded
        </p>
      </div>
    </header>
  );
}