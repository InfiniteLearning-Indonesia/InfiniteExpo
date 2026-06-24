"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Rocket,
  Users,
  Trophy,
  ArrowDown,
  ChevronRight,
  Monitor,
  Smartphone,
  Brain,
  Gamepad2,
  Sparkles,
  GraduationCap,
  ArrowUpRight,
  AlertCircle,
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBestProducts, getDashboardStats, type Project, type DashboardStats } from "@/lib/api/project.api";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [bestProjects, setBestProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bestRes, statsRes] = await Promise.all([
        getBestProducts({ limit: 6, randomize: true }),
        getDashboardStats(),
      ]);
      setBestProjects(bestRes.data || []);
      setStats(statsRes.data || null);
    } catch (err: any) {
      console.error("Failed to load homepage data:", err);
      if (!err.response) {
        setError("Unable to connect to the server. Please verify backend is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load exhibition data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const scrollToContent = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };



  const programs = [
    {
      id: "web",
      name: "Web Development",
      icon: Monitor,
      color: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
      border: "hover:border-blue-500/30",
      textColor: "text-blue-500"
    },
    {
      id: "mobile",
      name: "Mobile Development",
      icon: Smartphone,
      color: "from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20",
      border: "hover:border-green-500/30",
      textColor: "text-green-500"
    },
    {
      id: "ai",
      name: "AI Development",
      icon: Brain,
      color: "from-purple-500/10 to-violet-500/10 dark:from-purple-500/20 dark:to-violet-500/20",
      border: "hover:border-purple-500/30",
      textColor: "text-purple-500"
    },
    {
      id: "game",
      name: "Game Development",
      icon: Gamepad2,
      color: "from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20",
      border: "hover:border-red-500/30",
      textColor: "text-red-500"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 bg-gradient-hero">
        {/* Apple Atmospheric Glow background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#8A3DFF]/10 rounded-full blur-[140px] opacity-70"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.7, 0.6],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#8A3DFF]/10 text-[#A366FF] border border-[#8A3DFF]/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Capstone Exhibition 2026
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.08] max-w-4xl"
          >
            Where Student Ideas <br />
            <span className="text-gradient glow-text">Come to Life</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-normal"
          >
            Discover state-of-the-art capstone projects created by Infinite Learning mentees.
            Blending software development, designs, and AI algorithms to build solutions.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={scrollToContent}
              className="px-8 py-4 rounded-full bg-[#8A3DFF] text-white font-semibold text-sm flex items-center gap-2 hover:bg-[#A366FF] transition-all glow-accent apple-press"
            >
              Explore Innovation
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-full border border-border/60 bg-secondary/30 backdrop-blur-md font-semibold text-sm hover:bg-secondary/60 transition-colors apple-press"
            >
              View Gallery
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div
            onClick={scrollToContent}
            className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-destructive text-xs">{error}</p>
            </div>
            <button
              onClick={fetchHomeData}
              className="px-4 py-2 rounded-xl bg-[#8A3DFF] hover:bg-[#A366FF] text-white text-xs font-semibold transition-colors apple-press cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="relative py-16 border-y border-border/50 bg-background/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#8A3DFF]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#8A3DFF]" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              8000+
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Mentees</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#8A3DFF]/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-[#8A3DFF]" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              500+
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Projects</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#8A3DFF]/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#8A3DFF]" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              150+
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Best Projects</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#8A3DFF]/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#8A3DFF]" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              10
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Active Batch</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A3DFF] block mb-3">About Infiniteexpo</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Showcasing Project Excellence</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Infiniteexpo is an exhibition system tailored to highlight digital outcomes from Infinite Learning.
            We bring together technical implementation, human interface aesthetics, and scalable engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass rounded-3xl p-8 card-gradient relative group hover:border-[#8A3DFF]/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#8A3DFF]/10 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-[#8A3DFF]" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-foreground">Innovative Solutions</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Mentees create prototype features targeted to solve local and global socioeconomic challenges.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass rounded-3xl p-8 card-gradient relative group hover:border-[#8A3DFF]/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#8A3DFF]/10 flex items-center justify-center mb-6">
              <Monitor className="w-6 h-6 text-[#8A3DFF]" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-foreground">Modern Technologies</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Applications built with robust backends, microservices, and React frontend ecosystems.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass rounded-3xl p-8 card-gradient relative group hover:border-[#8A3DFF]/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-[#8A3DFF]/10 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-[#8A3DFF]" />
            </div>
            <h3 className="text-lg font-bold mb-3 text-foreground">Collaborative Teams</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fostering interdisciplinary collaboration across Hackers, Hipsters, Hustlers, and Scrum Masters.
            </p>
          </div>
        </div>
      </section>

      {/* Best Products Highlights Section */}
      <section id="highlights" className="py-24 px-6 bg-[#fafafa] dark:bg-zinc-950 border-t border-border/50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A3DFF] block mb-3">Award Achievements</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Exhibition Highlights</h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8A3DFF] hover:text-[#A366FF] transition-colors"
            >
              Explore All Projects
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 rounded-3xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : bestProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="group block h-full">
                  <div className="glass rounded-3xl overflow-hidden h-full flex flex-col hover:border-[#8A3DFF]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative h-52 overflow-hidden bg-secondary">
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

                      {/* Best Product Rank Badge */}
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-black shadow-md border-0">
                        <Trophy className="w-3 h-3" />
                        Best Product
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {project.team_name && (
                          <span className="text-xs font-semibold text-[#8A3DFF] block mb-2">{project.team_name}</span>
                        )}
                        <h3 className="text-lg font-bold mb-3 text-foreground line-clamp-1 group-hover:text-[#8a3dff] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
                          {project.description || "No description provided."}
                        </p>
                      </div>

                      {project.members && project.members.length > 0 && (
                        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Team:</span>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border/50 rounded-3xl">
              <Trophy className="w-12 h-12 text-[#8A3DFF]/30 mx-auto mb-4" />
              <h3 className="text-base font-bold mb-1">Coming Soon</h3>
              <p className="text-xs text-muted-foreground">Best projects will be announced shortly.</p>
            </div>
          )}
        </div>
      </section>

      {/* Program Grid Section */}
      <section id="programs" className="py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A3DFF] block mb-3">Tracks</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Diverse Learning Paths</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <Link
                key={program.name}
                href={`/programs?type=${program.id}`}
                className={`glass rounded-3xl p-6 transition-all duration-300 border border-border/50 ${program.border} bg-gradient-to-br ${program.color} flex flex-col justify-between min-h-[180px] group cursor-pointer hover:-translate-y-1 hover:shadow-lg apple-press`}
              >
                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm">
                  <Icon className={`w-6 h-6 ${program.textColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1 text-foreground">{program.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Learning Track</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
