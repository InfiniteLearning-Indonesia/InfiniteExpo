"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Rocket,
  ExternalLink,
  Layers,
  Brain,
  Smartphone,
  Gamepad2,
  Monitor,
  Cpu,
  Activity,
  Shield,
  Trophy,
  AlertCircle,
  Filter,
  Code2,
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

// Program definitions
interface Program {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  categories: ProjectCategory[];
  isActive: boolean;
  color: string;
  border: string;
  textColor: string;
  glowColor: string;
}

const programsList: Program[] = [
  {
    id: "web",
    name: "Web Development",
    description: "Building responsive, modern, and interactive web applications using front-end and back-end ecosystems.",
    categories: ["web_dev", "merge_web_ai", "merge_web_mobile", "merge_collab"],
    isActive: true,
    icon: Monitor,
    color: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
    border: "hover:border-blue-500/30",
    textColor: "text-blue-500",
    glowColor: "rgba(59, 130, 246, 0.15)"
  },
  {
    id: "mobile",
    name: "Mobile Development",
    description: "Creating native and cross-platform mobile apps for Android and iOS devices, from utility tools to dynamic services.",
    categories: ["mobile_dev", "merge_web_mobile", "merge_collab", "merge_mobile_ai"],
    isActive: true,
    icon: Smartphone,
    color: "from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20",
    border: "hover:border-green-500/30",
    textColor: "text-green-500",
    glowColor: "rgba(16, 185, 129, 0.15)"
  },
  {
    id: "ai",
    name: "AI Development",
    description: "Integrating machine learning models, computer vision, natural language processing, and advanced algorithm backends.",
    categories: ["ai_dev", "merge_web_ai", "merge_collab", "merge_mobile_ai"],
    isActive: true,
    icon: Brain,
    color: "from-purple-500/10 to-violet-500/10 dark:from-purple-500/20 dark:to-violet-500/20",
    border: "hover:border-purple-500/30",
    textColor: "text-purple-500",
    glowColor: "rgba(139, 92, 246, 0.15)"
  },
  {
    id: "game",
    name: "Game Development",
    description: "Crafting engaging 2D and 3D digital games with rich logic, assets, physics engines, and interactive controls.",
    categories: ["game_dev"],
    isActive: true,
    icon: Gamepad2,
    color: "from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20",
    border: "hover:border-red-500/30",
    textColor: "text-red-500",
    glowColor: "rgba(239, 68, 68, 0.15)"
  },
  {
    id: "aai",
    name: "Advance AI",
    description: "IBM Academy: Advance AI",
    categories: ["ibm_aai"],
    isActive: false,
    icon: Cpu,
    color: "from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-indigo-500/20",
    border: "hover:border-indigo-500/30",
    textColor: "text-indigo-500",
    glowColor: "rgba(99, 102, 241, 0.15)"
  },
  {
    id: "hcrh",
    name: "Hybrid Cloud & Red Hat",
    description: "IBM Academy: Hybrid Cloud & Red Hat",
    categories: ["hcrh"],
    isActive: false,
    icon: Activity,
    color: "from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-rose-500/20",
    border: "hover:border-rose-500/30",
    textColor: "text-rose-500",
    glowColor: "rgba(244, 63, 94, 0.15)"
  },
  {
    id: "cns",
    name: "Computer & Network Security",
    description: "Auditing network architectures, implementing penetration test setups, and threat mitigation schemes.",
    categories: ["comp_net_sec"],
    isActive: false,
    icon: Shield,
    color: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
    border: "hover:border-amber-500/30",
    textColor: "text-amber-500",
    glowColor: "rgba(245, 158, 11, 0.15)"
  }
];

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

function ProgramsContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [selectedProgram, setSelectedProgram] = useState<string>("web");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<number | "all">("all");

  // Read URL query parameter for default program type selection
  useEffect(() => {
    if (typeParam) {
      const exists = programsList.some((p) => p.id === typeParam);
      if (exists) {
        setSelectedProgram(typeParam);
      }
    }
  }, [typeParam]);

  // Load batches and default to the latest batch
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await getAllBatches();
        const batchList = res.data || [];
        setBatches(batchList);
        
        if (batchList.length > 0) {
          const sorted = [...batchList].sort((a, b) => b.batch_number - a.batch_number);
          setSelectedBatch(sorted[0].batch_number);
        }
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    };
    loadBatches();
  }, []);

  // Fetch projects data whenever batch changes
  const fetchProjectsData = async () => {
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

  // Filter projects by current program selection and search query
  const currentProgramDef = programsList.find((p) => p.id === selectedProgram) || programsList[0];
  
  const filteredProjects = projects.filter((project) => {
    // 1. Match program categories
    const isInCategory = project.category && currentProgramDef.categories.includes(project.category as ProjectCategory);
    if (!isInCategory) return false;

    // 2. Match search queries
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ai_technology?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getCategoryIcon = (category?: string) => {
    if (!category) return <Code2 className="w-3.5 h-3.5" />;
    if (category.includes("ai")) return <Brain className="w-3.5 h-3.5" />;
    if (category.includes("mobile")) return <Smartphone className="w-3.5 h-3.5" />;
    if (category.includes("game")) return <Gamepad2 className="w-3.5 h-3.5" />;
    return <Code2 className="w-3.5 h-3.5" />;
  };

  const activePrograms = programsList.filter((p) => p.isActive);
  const otherPrograms = programsList.filter((p) => !p.isActive);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-32 pb-12 px-6 bg-gradient-hero border-b border-border/40">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8A3DFF]/10 text-[#A366FF] border border-[#8A3DFF]/20">
              <Layers className="w-3.5 h-3.5" />
              Tracks Showcase
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Learning <span className="text-gradient">Programs</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
            Select a program track below to explore capstone projects built by our mentees. Includes dedicated and collaborative merge categories.
          </p>
        </div>
      </section>

      {/* Selector Grid Area */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full flex-grow flex flex-col gap-12">
        
        {/* Active Programs Selection */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#8A3DFF] mb-6">Active Learning Programs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activePrograms.map((program) => {
              const Icon = program.icon;
              const isSelected = selectedProgram === program.id;
              return (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program.id)}
                  className={`glass rounded-3xl p-6 text-left transition-all duration-300 border bg-gradient-to-br ${program.color} flex flex-col justify-between min-h-[180px] group apple-press relative overflow-hidden ${
                    isSelected 
                      ? "border-[#8A3DFF] shadow-lg scale-[1.01]" 
                      : "border-border/50 hover:border-border/80"
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 10px 30px -10px ${program.glowColor}` : undefined
                  }}
                >
                  {/* Subtle active glow backdrop */}
                  {isSelected && (
                    <span className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-25 blur-2xl" style={{ backgroundColor: program.textColor }} />
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm">
                    <Icon className={`w-6 h-6 ${program.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1 text-foreground">{program.name}</h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{program.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Other Programs Selection */}
        <div>
          <div className="w-full h-[1px] bg-border/40 mb-8" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Other Tracks & Specializations</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {otherPrograms.map((program) => {
              const Icon = program.icon;
              const isSelected = selectedProgram === program.id;
              return (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program.id)}
                  className={`glass rounded-3xl p-5 text-left transition-all duration-300 border bg-gradient-to-br ${program.color} flex items-center gap-4 group apple-press relative overflow-hidden ${
                    isSelected 
                      ? "border-[#8A3DFF] shadow-md scale-[1.01]" 
                      : "border-border/50 hover:border-border/80"
                  }`}
                  style={{
                    boxShadow: isSelected ? `0 8px 20px -8px ${program.glowColor}` : undefined
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm shrink-0">
                    <Icon className={`w-5 h-5 ${program.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{program.name}</h3>
                    <p className="text-[9px] text-muted-foreground line-clamp-1 mt-0.5">{program.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="w-full h-[1px] bg-border/40 my-2" />
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A3DFF]">Selected Track</span>
              <h3 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                {currentProgramDef.name} Showcase
              </h3>
            </div>

            {/* Inputs & Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search program projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <Select
                  value={selectedBatch === "all" ? "all" : String(selectedBatch)}
                  onValueChange={(val) => setSelectedBatch(val === "all" ? "all" : Number(val))}
                >
                  <SelectTrigger className="w-40 rounded-full bg-secondary/30 border-border/60 text-xs font-semibold">
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
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Found {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"} in this program
            </span>
          </div>

          {/* Projects Gallery Grid */}
          {error ? (
            <div className="text-center py-20 border border-destructive/20 bg-destructive/5 rounded-3xl max-w-2xl mx-auto w-full">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-1 text-foreground">Failed to Load Program Projects</h3>
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
              {[1, 2, 3].map((n) => (
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
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={fadeInUp} className="group">
                  <Link href={`/projects/${project.id}`} className="block h-full">
                    <div className="glass rounded-3xl overflow-hidden h-full flex flex-col hover:border-[#8A3DFF]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                      
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden bg-secondary">
                        {project.thumbnail ? (
                          <img
                            src={
                              project.thumbnail.startsWith("http")
                                ? project.thumbnail
                                : `http://localhost:7000${project.thumbnail}`
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

                        {/* Best Product badge */}
                        {project.is_best_product && (
                          <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-black shadow-md border-0">
                            <Trophy className="w-3 h-3" />
                            Best Product
                          </span>
                        )}

                        {/* Hover button overlay */}
                        <span className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </span>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          
                          {/* Program specific details / Category badge */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-secondary/80 text-foreground border border-border/50 mb-3">
                            {getCategoryIcon(project.category as string)}
                            {categoryLabels[project.category as ProjectCategory] || "Web Development"}
                          </span>

                          <h3 className="text-base font-bold mb-2 text-foreground line-clamp-1 group-hover:text-[#8a3dff] transition-colors">
                            {project.title}
                          </h3>

                          {project.team_name && (
                            <p className="text-xs font-semibold text-[#8A3DFF] mb-2">
                              {project.team_name}
                              {project.batch && (
                                <span className="text-muted-foreground font-normal"> • Batch {project.batch}</span>
                              )}
                            </p>
                          )}

                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
                            {project.description || "No description provided."}
                          </p>
                        </div>

                        {/* Team Members */}
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
              <p className="text-sm text-muted-foreground mb-6">We couldn't find any results under this program track with the current filters.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBatch("all");
                }}
                className="px-6 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF]"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>

      </section>

      <Footer />
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center animate-pulse">
          <Rocket className="w-10 h-10 text-[#8A3DFF] animate-bounce" />
        </div>
        <Footer />
      </div>
    }>
      <ProgramsContent />
    </Suspense>
  );
}
