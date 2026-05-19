import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  defaultValue,
}: {
  tabs: { value: string; label: string; content: React.ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? tabs[0]?.value} className="w-full">
      <TabsPrimitive.List className="inline-flex h-10 items-center gap-1 rounded-xl bg-zinc-100/80 p-1">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-sm font-medium text-zinc-500 transition-all",
              "data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm"
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.value} value={tab.value} className="mt-4 focus:outline-none">
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
