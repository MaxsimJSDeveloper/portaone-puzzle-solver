import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, Heading } from "@/ui/shared";

interface PuzzleGeneratorProps {
  onGenerated: (fragments: string[], name: string) => void;
}

export function PuzzleGenerator({ onGenerated }: PuzzleGeneratorProps) {
  const [mainLength, setMainLength] = useState<number>(1000);
  const [secondaryLength, setSecondaryLength] = useState<number>(200);
  const [deadEndsCount, setDeadEndsCount] = useState<number>(50);

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

    const datasetName = `Synthetic Dataset (${fragments.length} items)`;
    onGenerated(fragments, datasetName);
    toast.success(`Generated ${fragments.length} fragments with noise!`);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <Heading level={3}>Dataset Generator (Stress Test)</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
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
            <label className="block text-xs font-medium text-slate-400 mb-1">
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
            <label className="block text-xs font-medium text-slate-400 mb-1">
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

        <div className="flex justify-end pt-2">
          <Button onClick={generateData} icon={<Sparkles size={16} />}>
            Generate Test Dataset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}