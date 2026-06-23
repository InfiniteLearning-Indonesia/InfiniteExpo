"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  GraduationCap,
  Layers,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Rocket
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Layers, label: "Batches", href: "/admin/batches" },
  { icon: Users, label: "Teams", href: "/admin/teams" },
  { icon: GraduationCap, label: "Mentees", href: "/admin/mentees" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If auth loading is done and user is not authenticated (and not already on login), redirect to login
    if (pathname !== "/admin/login" && !isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // If on login page, render the standalone login page without sidebar shell or auth redirects
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // 1. Loading State Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Rocket className="w-10 h-10 text-[#8A3DFF] animate-bounce" />
      </div>
    );
  }

  // 2. Not Authenticated (will redirect, don't show admin contents)
  if (!isAuthenticated) {
    return null;
  }

  // 3. Authenticated Admin view
  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Mobile Sidebar Trigger Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Layout */}
      <aside
        className={`
          w-64 bg-card border-r border-border flex flex-col fixed h-full z-40
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <img src="/image.png" alt="Logo" className="h-10 w-auto object-contain" />
            <span className="text-lg font-bold">
              Infinite<span className="text-gradient">Expo</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">Admin Dashboard V2</p>
        </div>

        {/* Separator line */}
        <div className="h-px bg-border/50 mx-4" />

        {/* Sidebar Navigation menu items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border border-transparent apple-press
                ${
                  isActive(item.href)
                    ? "bg-[#8A3DFF]/10 text-[#8A3DFF] border-[#8A3DFF]/20 font-bold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
              {isActive(item.href) && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-md">
          {user && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#8A3DFF]/20 flex items-center justify-center border border-[#8A3DFF]/30 shrink-0">
                <span className="text-[#8A3DFF] font-semibold text-xs">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{user.name || "Administrator"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all text-xs font-semibold uppercase tracking-wider apple-press"
          >
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content viewport */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
