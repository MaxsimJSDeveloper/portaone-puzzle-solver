import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeId, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              isActive
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            {tab.icon && <span className={isActive ? "text-indigo-400" : "text-slate-500"}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}