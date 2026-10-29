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
        "inline-flex items-center gap-1 p-1 rounded-xl bg-[#170C28] border border-white/10",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer",
            activeTab === tab.id
              ? "bg-white/15 text-white shadow-sm font-semibold"
              : "text-zinc-400 hover:text-white"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
