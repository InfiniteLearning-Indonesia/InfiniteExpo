"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Rocket,
  ArrowLeft,
  ExternalLink,
  Video,
  Trophy,
  Users,
  Linkedin,
  Monitor,
  CheckCircle,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProjectById, type Project, categoryLabels, type ProjectCategory, parseDemoLinks } from "@/lib/api/project.api";
import { roleLabels, type MenteeRole } from "@/lib/api/mentee.api";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fetchProjectData = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProjectById(id);
      setProject(res.data || null);
    } catch (err: any) {
      console.error("Failed to load project details:", err);
      if (!err.response) {
        setError("Unable to connect to the server. Please verify backend is running.");
      } else {
        setError(err.response?.data?.message || "Failed to load project details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);
 
  useEffect(() => {
    if (project && project.screenshots) {
      try {
        const parsed = JSON.parse(project.screenshots);
        if (Array.isArray(parsed)) {
          setScreenshots(parsed);
        }
      } catch (e) {
        console.error("Failed to parse project screenshots:", e);
      }
    } else {
      setScreenshots([]);
    }
  }, [project]);
 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, screenshots.length]);

  // Video embed url generator
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    if (url.includes("drive.google.com/file/d/")) {
      const fileId = url.split("/file/d/")[1]?.split("/")[0]?.split("?")[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    if (url.includes("drive.google.com/drive/folders/")) {
      const folderId = url.split("/drive/folders/")[1]?.split("?")[0]?.split("/")[0];
      return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
    }
    if (url.includes("sharepoint.com")) {
      return url;
    }
    if (!url.endsWith(".mp4") && !url.endsWith(".webm") && !url.endsWith(".ogg") && !url.endsWith(".mov")) {
      return url;
    }
    return null;
  };

  const videoEmbedUrl = getEmbedUrl(project?.showcase_video);



  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Rocket className="w-10 h-10 text-[#8A3DFF] animate-bounce" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-lg font-bold mb-1">Failed to Load Project</h3>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">{error}</p>
          <div className="flex gap-3">
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-full border border-border/60 bg-secondary/35 font-semibold text-xs hover:bg-secondary/60 transition-colors flex items-center gap-1.5 apple-press"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Link>
            <button
              onClick={fetchProjectData}
              className="px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs hover:bg-[#A366FF] transition-colors flex items-center gap-1.5 apple-press cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        {/* Title & Badge */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary/80 text-foreground border border-border/50">
                {categoryLabels[project.category as ProjectCategory] || "Web Development"}
              </span>
              {project.category === "game_dev" && project.genre && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8A3DFF]/15 text-[#8A3DFF] border border-[#8A3DFF]/30">
                  {project.genre}
                </span>
              )}
              {project.is_best_product && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-black shadow-sm border-0">
                  <Trophy className="w-3 h-3" />
                  Best Product {project.best_product_rank ? `#${project.best_product_rank}` : ""}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              {project.title}
            </h1>
            {project.team_name && (
              <p className="text-sm font-semibold text-[#8A3DFF] mt-2">
                {project.category === "game_dev" ? `Studio: ${project.team_name}` : `Developed by: ${project.team_name}`}
                {project.batch && <span className="text-muted-foreground font-normal"> • Batch {project.batch}</span>}
              </p>
            )}
          </div>
        </div>

        {/* Project Thumbnail Image Section */}
        <div className="mb-12 rounded-3xl overflow-hidden glass aspect-video w-full border border-border/50 shadow-2xl bg-secondary relative">
          {project.thumbnail ? (
            <img
              src={
                project.thumbnail.startsWith("http")
                  ? project.thumbnail
                  : `http://localhost:7000${project.thumbnail}`
              }
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Rocket className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Detailed Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start mb-16">
          {/* Main Description Column */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="glass rounded-3xl p-8 border border-border/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#8A3DFF]" />
                Project Description
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {project.description || "No description provided."}
              </p>
            </div>

            {project.big_idea && (
              <div className="glass rounded-3xl p-8 border border-border/50">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-[#8A3DFF]" />
                  The Big Idea
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {project.big_idea}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar / Links & Tech Column */}
          <div className="flex flex-col gap-6">
            {/* Call to Actions Card */}
            {(() => {
              const demoParsed = parseDemoLinks(project.frontend_demo);

              // We only want to show Web Live Demo and Download APK (and Download Game if applicable)
              // We hide Huggingface AI Demo and all Source Code repositories
              const hasVisibleDemo = !!(demoParsed && (demoParsed.web_demo || demoParsed.mobile_apk || demoParsed.game_download)) || !!(!demoParsed && project.frontend_demo);

              return (
                <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resources</h3>
                  
                  {/* Demo Links */}
                  {demoParsed ? (
                    <>
                      {demoParsed.web_demo && (
                        <a
                          href={demoParsed.web_demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 rounded-full bg-[#8A3DFF] text-white text-center font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#A366FF] transition-all glow-accent apple-press"
                        >
                          Web Live Demo
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {demoParsed.mobile_apk && (
                        <a
                          href={demoParsed.mobile_apk}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 rounded-full bg-[#8A3DFF] text-white text-center font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#A366FF] transition-all glow-accent apple-press"
                        >
                          Download APK
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {demoParsed.game_download && (
                        <a
                          href={demoParsed.game_download}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 rounded-full bg-[#8A3DFF] text-white text-center font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#A366FF] transition-all glow-accent apple-press"
                        >
                          Download Game
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </>
                  ) : (
                    project.frontend_demo && (
                      <a
                        href={project.frontend_demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-full bg-[#8A3DFF] text-white text-center font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#A366FF] transition-all glow-accent apple-press"
                      >
                        Live Demo
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )
                  )}

                  {!hasVisibleDemo && (
                    <p className="text-xs text-muted-foreground italic">No external resource links available.</p>
                  )}
                </div>
              );
            })()}

            {/* Game Dev Metadata (Platforms & Genre) under resources card */}
            {project.category === "game_dev" && (
              <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Game Specifications</h3>
                
                <div className="flex flex-col gap-4">
                  {project.genre && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Genre</span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#8A3DFF]/10 text-[#8A3DFF] border border-[#8A3DFF]/25">
                        {project.genre}
                      </span>
                    </div>
                  )}
                  {project.platforms && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Platforms</span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.platforms.split(",").map((plat) => {
                          const trimmed = plat.trim();
                          if (!trimmed) return null;
                          return (
                            <span key={trimmed} className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary/60 text-foreground border border-border/50">
                              {trimmed}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Tech Card */}
            {project.ai_technology && (
              <div className="glass rounded-3xl p-6 border border-border/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Technology</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#8A3DFF]/10 flex items-center justify-center shrink-0">
                      <Rocket className="w-4 h-4 text-[#8A3DFF]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">AI / Algorithm</h4>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {project.ai_technology.split(",").map((tech) => {
                      const trimmed = tech.trim();
                      if (!trimmed) return null;
                      return (
                        <span key={trimmed} className="px-2.5 py-1 bg-[#8A3DFF]/10 text-[#8A3DFF] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#8A3DFF]/20">
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gameplay Screenshots Section for Game Dev */}
        {project.category === "game_dev" && screenshots.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#8A3DFF]/10 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-[#8A3DFF]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Gameplay Screenshots</h2>
            </div>
            
            {/* Scrollable Gallery */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scroll-smooth snap-x">
                {screenshots.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                    className="flex-shrink-0 w-72 sm:w-96 aspect-video rounded-2xl overflow-hidden border border-border/50 bg-secondary hover:border-[#8A3DFF]/50 transition-all duration-300 cursor-pointer snap-start hover:scale-[1.02] active:scale-[0.98] relative group"
                  >
                    <img
                      src={url.startsWith("http") ? url : `http://localhost:7000${url}`}
                      alt={`${project.title} Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
                        View Image
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Embed Section (Moved below description) */}
        {project.showcase_video && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#8A3DFF]/10 flex items-center justify-center">
                <Video className="w-4 h-4 text-[#8A3DFF]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Project Showcase Video</h2>
            </div>
            <div className="rounded-3xl overflow-hidden glass aspect-video w-full border border-border/50 shadow-2xl">
              {videoEmbedUrl ? (
                <iframe
                  src={videoEmbedUrl}
                  title="Showcase Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={project.showcase_video} controls className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        )}

        {/* Team Members Roster */}
        {project.members && project.members.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-[#8A3DFF]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#8A3DFF]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Meet the Team</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="glass rounded-3xl p-6 border border-border/50 flex items-center justify-between group hover:border-[#8A3DFF]/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar Icon */}
                    <div className="w-12 h-12 rounded-full bg-[#8A3DFF]/10 text-[#8A3DFF] flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-[#8A3DFF] transition-colors">
                        {member.name}
                        {member.is_scrum_master && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-amber-500 text-black">
                            SM
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {roleLabels[member.role as MenteeRole] || member.role}
                      </p>
                    </div>
                  </div>

                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-border bg-secondary/20 flex items-center justify-center text-muted-foreground hover:text-[#0a66c2] hover:bg-secondary transition-all apple-press"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
 
      {/* Lightbox Modal */}
      {lightboxOpen && screenshots.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 transition-opacity duration-300 animate-fade-in animate-duration-200">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors apple-press"
          >
            <X className="w-6 h-6" />
          </button>
 
          {/* Navigation Controls */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
                }}
                className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors apple-press"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors apple-press"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
 
          {/* Large Image Container */}
          <div className="max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center relative select-none">
            <img
              src={
                screenshots[lightboxIndex].startsWith("http")
                  ? screenshots[lightboxIndex]
                  : `http://localhost:7000${screenshots[lightboxIndex]}`
              }
              alt="Gameplay Screenshot Fullscreen"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl select-none"
            />
            {/* Caption */}
            <p className="text-white/60 text-xs font-semibold tracking-wider mt-4 uppercase">
              Screenshot {lightboxIndex + 1} of {screenshots.length}
            </p>
          </div>
        </div>
      )}
 
      <Footer />
    </div>
  );
}
