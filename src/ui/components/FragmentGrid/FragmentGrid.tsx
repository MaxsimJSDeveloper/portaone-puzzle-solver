import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Heading, Button } from "@/ui/shared";
import { FragmentCard } from "../FragmentCard/FragmentCard";

interface FragmentGridProps {
  fragments: string[];
}

export function FragmentGrid({ fragments }: FragmentGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 120;
  const totalPages = Math.ceil(fragments.length / pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [fragments]);

  if (fragments.length === 0) return null;

  const startIndex = (currentPage - 1) * pageSize;
  const displayedFragments = fragments.slice(startIndex, startIndex + pageSize);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Heading level={4}>Loaded Dataset Fragments ({fragments.length})</Heading>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            <Button 
              variant="outline" 
              className="px-2 py-1 h-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-xs font-mono text-slate-400 min-w-[4rem] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button 
              variant="outline" 
              className="px-2 py-1 h-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayedFragments.map((fragment, index) => (
          <FragmentCard key={`${startIndex + index}_${fragment}`} fragment={fragment} />
        ))}
      </div>
    </section>
  );
}