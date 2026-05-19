import * as React from "react";
import { Sidebar, type NavItem } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AppLayout({ items, basePath, children }: { items: NavItem[]; basePath: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar items={items} basePath={basePath} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
