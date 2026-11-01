import { DatasetParser } from "@/utils/datasetParser";
import { useState, useEffect } from "react";

export function useDataset(defaultUrl: string = "/source.txt") {
  const [fragments, setFragments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(defaultUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch default dataset");
        return res.text();
      })
      .then((text) => {
        const parsed = DatasetParser.parseText(text);
        setFragments(parsed);
        setError(null);
      })
      .catch((err) => {
        console.error("Dataset load error:", err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [defaultUrl]);

  const uploadCustomFile = async (file: File) => {
    try {
      setIsLoading(true);
      const parsed = await DatasetParser.parseFile(file);
      setFragments(parsed);
      setError(null);
    } catch (err) {
      console.error("File read error:", err);
      setError("Error parsing uploaded file");
    } finally {
      setIsLoading(false);
    }
  };

  return { fragments, setFragments, isLoading, error, uploadCustomFile };
}