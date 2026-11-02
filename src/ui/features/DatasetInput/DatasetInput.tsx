import { Upload, Database, Sparkles, Play } from "lucide-react";
import { Button, Card, CardContent, Tabs, type TabItem } from "@/ui/shared";
import { useDatasetInput } from "./useDatasetInput";

interface DatasetInputProps {
  onLoadFragments: (fragments: string[]) => void;
  isLoading?: boolean;
  onSolve: () => void;
  hasData: boolean;
}

export function DatasetInput({ onLoadFragments, isLoading, onSolve, hasData }: DatasetInputProps) {
  const {
    activeTab, setActiveTab,
    mainLength, setMainLength,
    secondaryLength, setSecondaryLength,
    deadEndsCount, setDeadEndsCount,
    handleFileUpload, handleLoadDefault, generateData
  } = useDatasetInput({ onLoadFragments });

  const tabs: TabItem[] = [
    { id: "file", label: "Upload File", icon: <Upload size={16} /> },
    { id: "default", label: "Default Dataset", icon: <Database size={16} /> },
    { id: "generator", label: "Generator", icon: <Sparkles size={16} /> },
  ];

  return (
    <Card>
      <CardContent className="space-y-4">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

        {activeTab === "file" && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all bg-slate-950/40">
            <Upload className="w-10 h-10 text-slate-500 mb-3" />
            <p className="text-sm text-slate-300 font-medium">Click to upload or drag .txt file</p>
            <p className="text-xs text-slate-500 mt-1">One numeric fragment per line</p>
            <label className="mt-4">
              <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" disabled={isLoading} />
              <span className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors inline-block">
                Select File
              </span>
            </label>
          </div>
        )}

        {activeTab === "default" && (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/30 rounded-xl border border-slate-800/50">
            <Database className="w-8 h-8 text-indigo-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">Load Original PortaOne Test Dataset</p>
              <p className="text-xs text-slate-400 mt-0.5">Loads source.txt located in public directory</p>
            </div>
            <Button variant="secondary" onClick={handleLoadDefault} isLoading={isLoading}>
              Fetch source.txt
            </Button>
          </div>
        )}

        {activeTab === "generator" && (
          <div className="space-y-5 p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Main Chain ({mainLength})</label>
                <input type="range" min={100} max={15000} step={100} value={mainLength} onChange={(e) => setMainLength(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Isolated Chain ({secondaryLength})</label>
                <input type="range" min={0} max={3000} step={50} value={secondaryLength} onChange={(e) => setSecondaryLength(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Dead End Branches ({deadEndsCount})</label>
                <input type="range" min={0} max={500} step={10} value={deadEndsCount} onChange={(e) => setDeadEndsCount(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-800/50">
              <Button onClick={generateData} icon={<Sparkles size={16} />} isLoading={isLoading}>
                Generate Test Dataset
              </Button>
            </div>
          </div>
        )}

        <div className="pt-5 mt-2 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            {hasData ? "Dataset ready for analysis." : "Please load a dataset first."}
          </p>
          <Button variant="primary" onClick={onSolve} disabled={!hasData || isLoading} isLoading={isLoading} icon={<Play size={16} />} className="w-full sm:w-auto px-8">
            {isLoading ? "Analyzing Graph..." : "Solve Puzzle"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}