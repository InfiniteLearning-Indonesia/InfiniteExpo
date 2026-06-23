"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Users,
  GraduationCap,
  Rocket,
  Layers,
  Star,
  Plus,
  ArrowUpRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { getDashboardStats, type DashboardStats } from "@/lib/api/project.api";
import { getActiveBatch, type Batch } from "@/lib/api/batch.api";

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, batchRes] = await Promise.allSettled([
        getDashboardStats(),
        getActiveBatch(),
      ]);

      let hasError = false;
      let errMsg = "Failed to load dashboard statistics.";

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data);
      } else {
        hasError = true;
        const reason: any = statsRes.reason;
        errMsg = reason.response?.data?.message || reason.message || "Failed to load dashboard statistics.";
      }

      if (batchRes.status === "fulfilled") {
        setActiveBatch(batchRes.value.data);
      } else {
        // active batch is optional (returns 404 if no active batch is seeded yet).
        // we only trigger a page-level error if it's a real server/network connection failure.
        const reason: any = batchRes.reason;
        const isConnError = !reason.response || reason.response.status !== 404;
        if (isConnError) {
          hasError = true;
          errMsg = reason.response?.data?.message || reason.message || "Failed to contact database server.";
        }
      }

      if (hasError) {
        setError(errMsg);
      }
    } catch (err: any) {
      console.error("Dashboard loading error:", err);
      setError("Failed to retrieve dashboard stats.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Rocket className="w-8 h-8 text-[#8A3DFF] animate-bounce mb-3" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading stats...</span>
      </div>
    );
  }

  const quickStats = [
    {
      label: "Total Projects",
      value: stats?.total_projects || stats?.totalProjects || 0,
      icon: FolderKanban,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 border-blue-500/15",
    },
    {
      label: "Published",
      value: stats?.published_projects || stats?.published_projects || 0,
      icon: Rocket,
      color: "text-green-500",
      bgColor: "bg-green-500/10 border-green-500/15",
    },
    {
      label: "Teams",
      value: stats?.total_teams || stats?.totalTeams || 0,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10 border-purple-500/15",
    },
    {
      label: "Mentees",
      value: stats?.total_mentees || stats?.totalMentees || 0,
      icon: GraduationCap,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10 border-orange-500/15",
    },
    {
      label: "Best Products",
      value: stats?.best_products || stats?.bestProducts || 0,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10 border-yellow-500/15",
    },
  ];

  const quickActions = [
    {
      label: "New Project",
      href: "/admin/projects",
      icon: FolderKanban,
      description: "Create exhibition item",
    },
    {
      label: "Batches Cohort",
      href: "/admin/batches",
      icon: Layers,
      description: "Set active batches",
    },
    {
      label: "Manage Teams",
      href: "/admin/teams",
      icon: Users,
      description: "Manage group rosters",
    },
    {
      label: "Mentee List",
      href: "/admin/mentees",
      icon: GraduationCap,
      description: "View and edit students",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8"
    >
      {/* Header Info */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}! 👋
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Summary metrics and shortcut control panel features.</p>
        </div>
        <div className="flex items-center gap-2">
          {activeBatch && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8A3DFF]/10 text-[#A366FF] border border-[#8A3DFF]/20">
              <Layers className="w-3.5 h-3.5" />
              {activeBatch.name || `Batch ${activeBatch.batch_number}`}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
            {user?.role === "admin" ? "Admin Auth" : "Standard user"}
          </span>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-destructive text-xs font-semibold">Dashboard loading warning</p>
              <p className="text-destructive/80 text-xs mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 rounded-xl bg-destructive/20 hover:bg-destructive/30 text-destructive text-xs font-semibold transition-colors apple-press cursor-pointer shrink-0"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Stats Widgets */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickStats.map((stat) => (
          <motion.div key={stat.label} variants={fadeInUp} whileHover={{ y: -2 }} className="h-full">
            <div className="glass rounded-3xl p-5 border border-border/50 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center border`}>
                  <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions Shortcuts */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Operations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="block h-full">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} className="h-full">
                <div className="glass rounded-3xl p-6 border border-border/50 hover:border-[#8A3DFF]/30 transition-all cursor-pointer group h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-[#8A3DFF]/10 flex items-center justify-center group-hover:bg-[#8A3DFF]/20 transition-colors">
                      <action.icon className="w-5 h-5 text-[#8A3DFF]" />
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground group-hover:text-[#8A3DFF] transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-[#8A3DFF] transition-colors">{action.label}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{action.description}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Active Batch Overview Card */}
      {activeBatch && (
        <motion.div variants={fadeInUp}>
          <div className="rounded-3xl border border-[#8A3DFF]/20 bg-gradient-to-r from-[#8A3DFF]/10 to-purple-500/5 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#8A3DFF]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A3DFF]">Active Cohort Segment</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {activeBatch.name || `Batch ${activeBatch.batch_number}`}
                </p>
                {activeBatch.start_date && activeBatch.end_date && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Timeline: {new Date(activeBatch.start_date).toLocaleDateString()} – {new Date(activeBatch.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Link href="/admin/batches">
                <button className="px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press">
                  Manage Cohorts
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
