import { useState, type ChangeEvent, } from "react";
import { Upload, Database } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, Tabs, type TabItem, } from "@/ui/shared";

interface DatasetInputProps {
  onLoadFragments: (fragments: string[], sourceName: string) => void;
  isLoading?: boolean;
}

export function DatasetInput({ onLoadFragments, isLoading }: DatasetInputProps) {
  const [activeTab, setActiveTab] = useState<string>("file");
//   const [rawText, setRawText] = useState<string>("");

  const tabs: TabItem[] = [
    { id: "file", label: "Upload File", icon: <Upload size={16} /> },
    // { id: "text", label: "Manual Text", icon: <FileText size={16} /> },
    { id: "default", label: "Default Dataset", icon: <Database size={16} /> },
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      onLoadFragments(lines, file.name);
      toast.success(`Loaded ${lines.length} lines from ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

//   const handleTextSubmit = () => {
//     const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
//     if (lines.length === 0) {
//       toast.error("Please enter at least one fragment");
//       return;
//     }
//     onLoadFragments(lines, "Custom Text");
//     toast.success(`Loaded ${lines.length} fragments from input`);
//   };

  const handleLoadDefault = async () => {
    try {
      const response = await fetch("/source.txt");
      if (!response.ok) throw new Error("Failed to load source.txt");
      const text = await response.text();
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      onLoadFragments(lines, "source.txt");
      toast.success(`Loaded default dataset (${lines.length} fragments)`);
    } catch (err) {
      toast.error("Error loading default dataset");
      console.error(err);
    }
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

        {/* {activeTab === "text" && (
          <div className="space-y-3">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste numeric fragments here (one per line)...&#10;e.g.&#10;248460&#10;608017"
              rows={5}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={handleTextSubmit} isLoading={isLoading}>
                Parse Fragments
              </Button>
            </div>
          </div>
        )} */}

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
      </CardContent>
    </Card>
  );
}