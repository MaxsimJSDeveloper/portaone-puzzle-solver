import { FragmentCard } from "../FragmentCard/FragmentCard";
import { Heading } from "@/ui/shared";

interface FragmentGridProps {
  fragments: string[];
}

export function FragmentGrid({ fragments }: FragmentGridProps) {
  const displayedFragments = fragments.slice(0, 120);
  const hasMore = fragments.length > 120;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading level={4}>
          Loaded Dataset Fragments ({fragments.length})
        </Heading>
        {hasMore && (
          <span className="text-xs text-slate-500 font-mono">
            Showing first 120 fragments
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayedFragments.map((fragment, index) => (
          <FragmentCard key={`${index}_${fragment}`} fragment={fragment} />
        ))}
      </div>
    </section>
  );
}