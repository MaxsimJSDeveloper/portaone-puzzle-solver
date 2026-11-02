import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Header, FragmentGrid } from "@/ui/components";
import { DatasetInput, ResultViewer } from "@/ui/features";
import { useDataset } from "@/ui/hooks";
import { PuzzleSolver } from "@/core/puzzleSolver";
import type { ISolverResult } from "@/core/types";

export function App() {
  const { fragments, setFragments } = useDataset("/source.txt");
  const [solverResult, setSolverResult] = useState<ISolverResult | null>(null);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [isSolving, setIsSolving] = useState<boolean>(false);

  const handleDatasetLoaded = (newFragments: string[]) => {
    setFragments(newFragments);
    setSolverResult(null);
  };

  const solve = () => {
    setIsSolving(true);
    setTimeout(() => {
      const startTime = performance.now();
      const solver = new PuzzleSolver(fragments);
      const result = solver.solve();
      const endTime = performance.now();

      setSolverResult(result);
      setExecutionTime(endTime - startTime);
      setIsSolving(false);

      if (result.sequence) toast.success(`Puzzle solved in ${(endTime - startTime).toFixed(2)} ms!`);
      else toast.error("Could not construct sequence.");
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 font-sans selection:bg-indigo-500/30">
      <Toaster position="top-right" theme="dark" richColors />
      
      <div className="max-w-6xl mx-auto space-y-10">
        <Header fragmentsCount={fragments.length} />

        <main className="space-y-12">
          <div className="max-w-2xl mx-auto">
            <DatasetInput 
              onLoadFragments={handleDatasetLoaded} 
              isLoading={isSolving} 
              onSolve={solve}
              hasData={fragments.length > 0}
            />
          </div>

          {solverResult && (
            <ResultViewer result={solverResult} executionTimeMs={executionTime} />
          )}

          <FragmentGrid fragments={fragments} />
        </main>
      </div>
    </div>
  );
}

export default App;