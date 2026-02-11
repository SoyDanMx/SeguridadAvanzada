"use client";

import * as React from "react";
import { Shield, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { CATEGORY_LINKS } from "@/lib/categories";

export function CategorySidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const { open: mobileOpen, setOpen: setMobileOpen } = useSidebar();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-border bg-background-alt shadow-xl transition-transform duration-200 lg:static lg:block lg:w-56 lg:shrink-0 lg:shadow-none",
          collapsed && "lg:w-14",
          !mobileOpen && "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Categorías"
      >
        <div className="flex h-full flex-col lg:sticky lg:top-[10rem] lg:h-[calc(100vh-10rem)]">
          <div className="flex items-center justify-between border-b border-border px-3 py-3">
            <div className="flex flex-1 items-center gap-2">
              {!collapsed && (
                <span className="text-sm font-semibold text-primary">
                  Categorías
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="rounded p-2 text-primary hover:bg-background lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                className="hidden rounded p-2 text-primary hover:bg-background lg:block"
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {CATEGORY_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-background",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Shield className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
    </>
  );
}
