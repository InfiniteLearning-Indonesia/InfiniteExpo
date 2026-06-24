"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Rocket,
  ArrowLeft,
  ExternalLink,
  Layers,
  Brain,
  Smartphone,
  Gamepad2,
  Code2,
  Trophy,
  AlertCircle,
  Filter,
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublishedProjects, type Project, categoryLabels, type ProjectCategory } from "@/lib/api/project.api";
import { getAllBatches, type Batch } from "@/lib/api/batch.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryFilter = "all" | ProjectCategory;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<number | "all" | null>(null);

  // Load batches and default to the active batch
  useEffect(() => {
    const loadBatchesAndDefault = async () => {
      try {
        const res = await getAllBatches();
        const batchList = res.data || [];
        setBatches(batchList);
        
        if (batchList.length > 0) {
          // Find active batch first, fallback to the latest batch
          const activeBatchObj = batchList.find((b) => b.is_active);
          if (activeBatchObj) {
            setSelectedBatch(activeBatchObj.batch_number);
          } else {
            const sorted = [...batchList].sort((a, b) => b.batch_number - a.batch_number);
            setSelectedBatch(sorted[0].batch_number);
          }
        } else {
          setSelectedBatch("all");
        }
      } catch (err) {
        console.error("Failed to load batches:", err);
        setSelectedBatch("all");
      }
    };
    loadBatchesAndDefault();
  }, []);

  const fetchProjectsData = async () => {
    if (selectedBatch === null) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPublishedProjects({
        batch: selectedBatch === "all" ? undefined : selectedBatch
      });
      setProjects(res.data || []);
    } catch (err: any) {
      console.error("Failed to load projects:", err);
      if (!err.response) {
        setError("Unable to connect to the server. Please verify the backend is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load projects database.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, [selectedBatch]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ai_technology?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || project.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aBest = a.is_best_product ? 1 : 0;
    const bBest = b.is_best_product ? 1 : 0;
    return bBest - aBest;
  });

  const getCategoryIcon = (category?: string) => {
    if (!category) return <Code2 className="w-3.5 h-3.5" />;
    if (category.includes("ai")) return <Brain className="w-3.5 h-3.5" />;
    if (category.includes("mobile")) return <Smartphone className="w-3.5 h-3.5" />;
    if (category.includes("game")) return <Gamepad2 className="w-3.5 h-3.5" />;
    return <Code2 className="w-3.5 h-3.5" />;
  };

  const categoriesList: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All Works" },
    ...Object.entries(categoryLabels).map(([key, value]) => ({
      value: key as CategoryFilter,
      label: value,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 px-6 bg-gradient-hero border-b border-border/40">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8A3DFF]/10 text-[#A366FF] border border-[#8A3DFF]/20">
              <Layers className="w-3.5 h-3.5" />
              Exhibition Gallery
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Creative <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mb-8 leading-relaxed">
            Browse through all capstone projects build by Infinite Learning students. Use search inputs and category filters to narrow down the gallery.
          </p>

          {/* Search and Filters Layout */}
          <div className="flex flex-col gap-6">
            {/* Search and Batch Dropdown Container */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full max-w-3xl">
              <div className="relative flex-grow max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects, technology, or teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select
                  value={selectedBatch === null || selectedBatch === "all" ? "all" : String(selectedBatch)}
                  onValueChange={(val) => setSelectedBatch(val === "all" ? "all" : Number(val))}
                >
                  <SelectTrigger className="w-44 rounded-full bg-secondary/30 border-border/60 text-xs font-semibold">
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {batches.map((b) => (
                      <SelectItem key={b.id} value={String(b.batch_number)}>
                        Batch {b.batch_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Apple-style Navigation Categories Filter */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all apple-press border ${
                    categoryFilter === cat.value
                      ? "bg-[#8A3DFF] text-white border-transparent"
                      : "bg-secondary/40 text-muted-foreground border-border/50 hover:text-foreground hover:bg-secondary/70"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid View */}
      <section className="py-12 px-6 flex-grow max-w-7xl mx-auto w-full">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Found {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
          </span>
        </div>

        {error ? (
          <div className="text-center py-20 border border-destructive/20 bg-destructive/5 rounded-3xl max-w-2xl mx-auto w-full">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1 text-foreground">Failed to Load Gallery</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchProjectsData}
              className="px-6 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] apple-press cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sortedProjects.map((project) => (
              <motion.div key={project.id} variants={fadeInUp} className="group">
                <Link href={`/projects/${project.id}`} className="block h-full">
                  <div className="glass rounded-3xl overflow-hidden h-full flex flex-col hover:border-[#8A3DFF]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-secondary">
                      {project.thumbnail ? (
                        <img
                          src={
                            project.thumbnail.startsWith("http")
                              ? project.thumbnail
                              : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"}${project.thumbnail}`
                          }
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Rocket className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80" />

                      {/* Rank badge */}
                      {project.is_best_product && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-black shadow-md border-0">
                          <Trophy className="w-3 h-3" />
                          Best Product {project.batch ? `(B${project.batch})` : ""}
                        </span>
                      )}

                      {/* Link hover button */}
                      <span className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category Badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-secondary/80 text-foreground border border-border/50 mb-3">
                          {getCategoryIcon(project.category as string)}
                          {categoryLabels[project.category as ProjectCategory] || "Web Development"}
                        </span>

                        <h3 className="text-base font-bold mb-2 text-foreground line-clamp-1 group-hover:text-[#8a3dff] transition-colors">
                          {project.title}
                        </h3>

                        {(project.team_name || project.batch) && (
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {project.team_name && (
                              <span className="text-xs font-semibold text-[#8A3DFF]">
                                {project.team_name}
                              </span>
                            )}
                            {project.batch && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#8A3DFF]/10 text-[#8A3DFF] border border-[#8A3DFF]/20">
                                Batch {project.batch}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
                          {project.description || "No description provided."}
                        </p>
                      </div>

                      {/* Members Roster */}
                      {project.members && project.members.length > 0 && (
                        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Team Roster:</span>
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {project.members.slice(0, 4).map((member) => (
                              <div
                                key={member.id}
                                className="h-6 w-6 rounded-full border border-background bg-secondary flex items-center justify-center text-muted-foreground cursor-help"
                                title={`${member.name} - ${member.role}`}
                              >
                                <User className="w-3.5 h-3.5" />
                              </div>
                            ))}
                            {project.members.length > 4 && (
                              <div className="h-6 w-6 rounded-full border border-background bg-[#8A3DFF] text-[10px] font-bold flex items-center justify-center text-white">
                                +{project.members.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border/50 rounded-3xl">
            <Rocket className="w-12 h-12 text-[#8A3DFF]/30 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-bold mb-1">No Projects Found</h3>
            <p className="text-sm text-muted-foreground mb-6">We couldn't find any results matching your search terms.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
              className="px-6 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
