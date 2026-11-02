import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { FragmentValidator } from "@/core/services";
import { generatePuzzleDataset } from "@/utils";

interface UseDatasetInputProps {
  onLoadFragments: (fragments: string[]) => void;
}

export function useDatasetInput({ onLoadFragments }: UseDatasetInputProps) {
  const [activeTab, setActiveTab] = useState<string>("file");
  const [mainLength, setMainLength] = useState<number>(1000);
  const [secondaryLength, setSecondaryLength] = useState<number>(200);
  const [deadEndsCount, setDeadEndsCount] = useState<number>(50);

  const validator = new FragmentValidator();

  const processAndLoad = (lines: string[], sourceName: string) => {
    const { valid, rejected } = validator.validate(lines);
    
    if (valid.length === 0) {
      toast.error("File contains no valid numeric fragments (minimum 4 digits required).");
      return;
    }
    
    if (rejected.length > 0) {
      toast.warning(`Loaded ${valid.length} fragments. Ignored ${rejected.length} invalid lines.`);
    } else {
      toast.success(`Loaded ${valid.length} valid fragments from ${sourceName}`);
    }
    
    onLoadFragments(valid);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      processAndLoad(lines, file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleLoadDefault = async () => {
    try {
      const response = await fetch("/source.txt");
      if (!response.ok) throw new Error("Failed to load");
      const text = await response.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      processAndLoad(lines, "source.txt");
    } catch (err) {
      toast.error("Error loading default dataset");
    }
  };

  const generateData = () => {
    const fragments = generatePuzzleDataset({ mainLength, secondaryLength, deadEndsCount });
    onLoadFragments(fragments);
    toast.success(`Generated ${fragments.length} fragments with noise!`);
  };

  return {
    activeTab, setActiveTab,
    mainLength, setMainLength,
    secondaryLength, setSecondaryLength,
    deadEndsCount, setDeadEndsCount,
    handleFileUpload, handleLoadDefault, generateData
  };
}