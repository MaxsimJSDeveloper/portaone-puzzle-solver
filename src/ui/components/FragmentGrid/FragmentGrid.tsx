import { FragmentCard } from "../FragmentCard/FragmentCard";

interface FragmentGridProps {
  fragments: string[];
}

export function FragmentGrid({ fragments }: FragmentGridProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
        Loaded Dataset Fragments ({fragments.length})
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {fragments.map((fragment, index) => (
          <FragmentCard key={index} fragment={fragment} />
        ))}
      </div>
    </section>
  );
}