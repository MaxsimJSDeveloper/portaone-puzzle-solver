interface FragmentCardProps {
  fragment: string;
}

export function FragmentCard({ fragment }: FragmentCardProps) {
  const head = fragment.slice(0, 2);
  const body = fragment.slice(2, -2);
  const tail = fragment.slice(-2);

  return (
    <div className="p-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl font-mono text-sm flex justify-center items-center gap-0.5 transition-all group cursor-default">
      <span className="text-blue-400 font-bold group-hover:text-blue-300">
        {head}
      </span>
      <span className="text-slate-400">{body}</span>
      <span className="text-indigo-400 font-bold group-hover:text-indigo-300">
        {tail}
      </span>
    </div>
  );
}