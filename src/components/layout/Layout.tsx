import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
  module?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, module }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar module={module} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar module={module} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
