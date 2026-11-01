import { useState, type ChangeEvent } from "react";
import { Upload, Database, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, Tabs, type TabItem } from "@/ui/shared";

interface DatasetInputProps {
  onLoadFragments: (fragments: string[]) => void;
  isLoading?: boolean;
}

export function DatasetInput({ onLoadFragments, isLoading }: DatasetInputProps) {
  const [activeTab, setActiveTab] = useState<string>("file");

  // Стан для генератора
  const [mainLength, setMainLength] = useState<number>(1000);
  const [secondaryLength, setSecondaryLength] = useState<number>(200);
  const [deadEndsCount, setDeadEndsCount] = useState<number>(50);

  const tabs: TabItem[] = [
    { id: "file", label: "Upload File", icon: <Upload size={16} /> },
    { id: "default", label: "Default Dataset", icon: <Database size={16} /> },
    { id: "generator", label: "Generator", icon: <Sparkles size={16} /> },
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      onLoadFragments(lines);
      toast.success(`Loaded ${lines.length} lines from ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleLoadDefault = async () => {
    try {
      const response = await fetch("/source.txt");
      if (!response.ok) throw new Error("Failed to load source.txt");
      const text = await response.text();
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      onLoadFragments(lines);
      toast.success(`Loaded default dataset (${lines.length} fragments)`);
    } catch (err) {
      toast.error("Error loading default dataset");
      console.error(err);
    }
  };

  const generateData = () => {
    const fragments: string[] = [];

    const generateChain = (length: number, startNode?: string) => {
      const chain: string[] = [];
      let currentTail = startNode || Math.floor(Math.random() * 100).toString().padStart(2, "0");

      for (let i = 0; i < length; i++) {
        const middleAndTail = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
        const fragment = currentTail + middleAndTail;
        chain.push(fragment);
        currentTail = middleAndTail.slice(-2);
      }
      return chain;
    };

    const mainChain = generateChain(mainLength);
    fragments.push(...mainChain);

    if (secondaryLength > 0) {
      const secondaryChain = generateChain(secondaryLength);
      fragments.push(...secondaryChain);
    }

    for (let i = 0; i < deadEndsCount; i++) {
      const randomMainFragment = mainChain[Math.floor(Math.random() * mainChain.length)];
      const attachNode = randomMainFragment.slice(-2);
      const deadEndLength = Math.floor(Math.random() * 3) + 1;
      const deadEnd = generateChain(deadEndLength, attachNode);
      fragments.push(...deadEnd);
    }

    for (let i = fragments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fragments[i], fragments[j]] = [fragments[j], fragments[i]];
    }

    onLoadFragments(fragments);
    toast.success(`Generated ${fragments.length} fragments with noise!`);
  };

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
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
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
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Main Chain ({mainLength})
                </label>
                <input
                  type="range"
                  min={100}
                  max={15000}
                  step={100}
                  value={mainLength}
                  onChange={(e) => setMainLength(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Isolated Chain ({secondaryLength})
                </label>
                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={50}
                  value={secondaryLength}
                  onChange={(e) => setSecondaryLength(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Dead Ends ({deadEndsCount})
                </label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={deadEndsCount}
                  onChange={(e) => setDeadEndsCount(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-800/50">
              <Button onClick={generateData} icon={<Sparkles size={16} />} isLoading={isLoading}>
                Generate Test Dataset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}