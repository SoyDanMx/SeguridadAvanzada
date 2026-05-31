"use client";

import * as React from "react";

type SidebarContextType = { open: boolean; setOpen: (v: boolean) => void };

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  return ctx ?? { open: false, setOpen: () => {} };
}
