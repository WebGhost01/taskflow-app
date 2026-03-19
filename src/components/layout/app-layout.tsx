import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, CheckSquare, Folders, KanbanSquare, Plus } from "lucide-react";
import { cn, Button } from "@/components/ui-custom";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: Folders },
    { name: "My Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Board", href: "/board", icon: KanbanSquare },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200/60 bg-white/80 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center text-white">
              <CheckSquare className="w-5 h-5" />
            </div>
            TaskFlow
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-200 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              US
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 leading-none">User Session</span>
              <span className="text-xs text-slate-500">Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-slate-200/60 bg-white/60 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="md:hidden font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-primary/20 bg-primary/10 flex items-center justify-center text-primary">
              <CheckSquare className="w-4 h-4" />
            </div>
            TaskFlow
          </div>
          <div className="hidden md:flex flex-1"></div>
        </header>
        
        <div className="flex-1 overflow-y-auto kanban-scroll p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 pb-safe">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center p-2 text-xs text-slate-500">
              <item.icon className={cn("w-6 h-6 mb-1", isActive && "text-primary")} />
              <span className={cn(isActive && "text-primary font-medium")}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
