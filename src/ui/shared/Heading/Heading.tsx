import type { HTMLAttributes, ReactNode } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
}

export function Heading({ children, level = 2, className = "", ...props }: HeadingProps) {
  const tags = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
  } as const;

  const styles = {
    1: "text-3xl font-extrabold tracking-tight text-slate-100",
    2: "text-xl font-bold tracking-tight text-slate-200",
    3: "text-lg font-semibold text-slate-300",
    4: "text-sm font-medium uppercase tracking-wider text-slate-400",
  };

  const Tag = tags[level];

  return (
    <Tag className={`${styles[level]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}