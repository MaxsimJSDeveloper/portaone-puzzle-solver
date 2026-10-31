import { useState } from "react";
import { PuzzleSolver } from "@/core/puzzleSolver";
import { Header, SolutionCard, FragmentGrid } from "@/ui/components";
import { useDataset } from "@/ui/hooks";

export function App() {
  const { fragments, uploadCustomFile } = useDataset("/source.txt");
  const [solution, setSolution] = useState<string>("");
  const [isSolving, setIsSolving] = useState<boolean>(false);

  const solve = () => {
    setIsSolving(true);
    setTimeout(() => {
      const solver = new PuzzleSolver(fragments);
      const result = solver.solve();
      setSolution(result);
      setIsSolving(false);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <Header
          fragmentsCount={fragments.length}
          isSolving={isSolving}
          onSolve={solve}
          onFileUpload={uploadCustomFile}
        />

        <main className="space-y-8">
          {solution && <SolutionCard solution={solution} />}
          <FragmentGrid fragments={fragments} />
        </main>
      </div>
    </div>
  );
}

export default App;