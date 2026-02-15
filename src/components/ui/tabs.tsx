"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabSwitcher({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabSwitcherProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
            activeTab === tab.id
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
