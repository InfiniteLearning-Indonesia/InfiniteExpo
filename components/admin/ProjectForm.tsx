"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Users,
  Linkedin
} from "lucide-react";
import {
  createProject,
  updateProject,
  getProjectById,
  categoryLabels,
  type ProjectCategory,
  parseDemoLinks,
  parseRepoLinks
} from "@/lib/api/project.api";
import { programLabels, allPrograms, type MenteeProgram } from "@/lib/api/mentee.api";
import { getAllBatches, getActiveBatch, type Batch } from "@/lib/api/batch.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMemberInput {
  id?: number;
  name: string;
  role: string;
  program: MenteeProgram;
  linkedin_url?: string;
}

const roleOptions: { value: string; label: string }[] = [
  { value: "hustler", label: "Hustler / PM" },
  { value: "hacker", label: "Hacker" },
  { value: "hipster", label: "Hipster" },
  { value: "design_researcher", label: "Design Researcher" },
  { value: "data_engineer", label: "Data Engineer" },
  { value: "ml_engineer", label: "ML Engineer" },
  { value: "ml_ops", label: "ML Ops" },
  { value: "game_designer", label: "Game Designer" },
  { value: "game_artist", label: "Game Artist" },
  { value: "game_programmer", label: "Game Programmer" },
  { value: "scrum_master", label: "Scrum Master" },
];

export default function ProjectForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEditing = !!id;

  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    big_idea: "",
    category: "web_dev" as ProjectCategory | string,
    frontend_demo: "",
    repository: "",
    ai_technology: "",
    showcase_video: "",
    batch: "",
    team_name: "",
    is_published: false,
    is_best_product: false,
    genre: "",
    platforms: "",
  });

  const [subFields, setSubFields] = useState({
    web_demo: "",
    web_repo: "",
    mobile_apk: "",
    mobile_repo: "",
    ai_huggingface: "",
    ai_repo: "",
    ai_tech: "",
    game_download: "",
    game_repo: "",
    aai_repo: "",
    hcrh_repo: "",
    cns_repo: "",
  });

  const getActivePlatforms = useCallback((category: string) => {
    const platforms: {
      web?: boolean;
      mobile?: boolean;
      ai?: boolean;
      game?: boolean;
      aai?: boolean;
      hcrh?: boolean;
      cns?: boolean;
    } = {};

    if (category === "web_dev") {
      platforms.web = true;
    } else if (category === "mobile_dev") {
      platforms.mobile = true;
    } else if (category === "ai_dev") {
      platforms.ai = true;
    } else if (category === "game_dev") {
      platforms.game = true;
    } else if (category === "ibm_aai") {
      platforms.aai = true;
    } else if (category === "hcrh") {
      platforms.hcrh = true;
    } else if (category === "comp_net_sec") {
      platforms.cns = true;
    } else if (category === "merge_web_ai") {
      platforms.web = true;
      platforms.ai = true;
    } else if (category === "merge_web_mobile") {
      platforms.web = true;
      platforms.mobile = true;
    } else if (category === "merge_mobile_ai") {
      platforms.mobile = true;
      platforms.ai = true;
    } else if (category === "merge_collab") {
      platforms.web = true;
      platforms.mobile = true;
      platforms.ai = true;
    }
    return platforms;
  }, []);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
  const [newScreenshotFiles, setNewScreenshotFiles] = useState<File[]>([]);
  const [newScreenshotPreviews, setNewScreenshotPreviews] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const batchesRes = await getAllBatches();
      setBatches(batchesRes.data || []);

      try {
        const activeRes = await getActiveBatch();
        if (!isEditing) {
          setFormData((prev) => ({
            ...prev,
            batch: String(activeRes.data.batch_number),
          }));
        }
      } catch {
        // No active batch
      }

      if (isEditing && id) {
        const projectRes = await getProjectById(id);
        const project = projectRes.data;
        setFormData({
          title: project.title || "",
          description: project.description || "",
          big_idea: project.big_idea || "",
          category: project.category || "web_dev",
          frontend_demo: project.frontend_demo || "",
          repository: project.repository || "",
          ai_technology: project.ai_technology || "",
          showcase_video: project.showcase_video || "",
          batch: project.batch ? String(project.batch) : "",
          team_name: project.team_name || "",
          is_published: project.is_published || false,
          is_best_product: project.is_best_product || false,
          genre: project.genre || "",
          platforms: project.platforms || "",
        });

        if (project.screenshots) {
          try {
            const parsed = JSON.parse(project.screenshots);
            if (Array.isArray(parsed)) {
              setExistingScreenshots(parsed);
            }
          } catch (e) {
            console.error("Failed to parse screenshots JSON:", e);
          }
        }

        const demoParsed = parseDemoLinks(project.frontend_demo);
        const repoParsed = parseRepoLinks(project.repository);

        const loadedSubFields = {
          web_demo: "",
          web_repo: "",
          mobile_apk: "",
          mobile_repo: "",
          ai_huggingface: "",
          ai_repo: "",
          ai_tech: project.ai_technology || "",
          game_download: "",
          game_repo: "",
          aai_repo: "",
          hcrh_repo: "",
          cns_repo: "",
        };

        const currentCategory = project.category || "web_dev";
        const platforms = getActivePlatforms(currentCategory);

        if (demoParsed) {
          loadedSubFields.web_demo = demoParsed.web_demo || "";
          loadedSubFields.mobile_apk = demoParsed.mobile_apk || "";
          loadedSubFields.ai_huggingface = demoParsed.ai_huggingface || "";
          loadedSubFields.game_download = demoParsed.game_download || "";
        } else if (project.frontend_demo) {
          if (platforms.web) loadedSubFields.web_demo = project.frontend_demo;
          else if (platforms.mobile) loadedSubFields.mobile_apk = project.frontend_demo;
          else if (platforms.ai) loadedSubFields.ai_huggingface = project.frontend_demo;
          else if (platforms.game) loadedSubFields.game_download = project.frontend_demo;
        }

        if (repoParsed) {
          loadedSubFields.web_repo = repoParsed.web_repo || "";
          loadedSubFields.mobile_repo = repoParsed.mobile_repo || "";
          loadedSubFields.ai_repo = repoParsed.ai_repo || "";
          loadedSubFields.game_repo = repoParsed.game_repo || "";
          loadedSubFields.aai_repo = repoParsed.aai_repo || "";
          loadedSubFields.hcrh_repo = repoParsed.hcrh_repo || "";
          loadedSubFields.cns_repo = repoParsed.cns_repo || "";
        } else if (project.repository) {
          if (platforms.web) loadedSubFields.web_repo = project.repository;
          else if (platforms.mobile) loadedSubFields.mobile_repo = project.repository;
          else if (platforms.ai) loadedSubFields.ai_repo = project.repository;
          else if (platforms.game) loadedSubFields.game_repo = project.repository;
          else if (platforms.aai) loadedSubFields.aai_repo = project.repository;
          else if (platforms.hcrh) loadedSubFields.hcrh_repo = project.repository;
          else if (platforms.cns) loadedSubFields.cns_repo = project.repository;
        }

        setSubFields(loadedSubFields);

        if (project.thumbnail) {
          setThumbnailPreview(
            project.thumbnail.startsWith("http")
              ? project.thumbnail
              : `${process.env.NEXT_PUBLIC_API_URL || "https://api-exhibition.infinitelearningstudent.id"}${project.thumbnail}`
          );
        }

        if (project.members) {
          setTeamMembers(
            project.members.map((m) => ({
              id: m.id,
              name: m.name,
              role: m.role,
              program: (m.program || "web_uiux") as MenteeProgram,
              linkedin_url: m.linkedin_url || "",
            }))
          );
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve project details");
    } finally {
      setIsLoading(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { name: "", role: "hacker", program: "web_uiux", linkedin_url: "" },
    ]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMemberInput,
    value: string | boolean
  ) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      setError("Product Name is required");
      return;
    }
    const isGameDev = formData.category === "game_dev";
    if (!formData.team_name) {
      setError(isGameDev ? "Studio Name is required" : "Team Name is required");
      return;
    }
    if (isGameDev && !formData.genre) {
      setError("Genre is required for Game Dev projects");
      return;
    }
    if (isGameDev && !formData.platforms) {
      setError("Platforms are required for Game Dev projects");
      return;
    }
    if (teamMembers.length === 0) {
      setError("At least one team member is required");
      return;
    }
    if (teamMembers.some((m) => !m.name.trim())) {
      setError("All team members must have a name");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const platforms = getActivePlatforms(formData.category);
      const demoData: Record<string, string> = {};
      const repoData: Record<string, string> = {};

      if (platforms.web) {
        demoData.web_demo = subFields.web_demo;
        repoData.web_repo = subFields.web_repo;
      }
      if (platforms.mobile) {
        demoData.mobile_apk = subFields.mobile_apk;
        repoData.mobile_repo = subFields.mobile_repo;
      }
      if (platforms.ai) {
        demoData.ai_huggingface = subFields.ai_huggingface;
        repoData.ai_repo = subFields.ai_repo;
      }
      if (platforms.game) {
        demoData.game_download = subFields.game_download;
        // GitHub repository is hidden/removed for game dev projects
      }
      if (platforms.aai) {
        repoData.aai_repo = subFields.aai_repo;
      }
      if (platforms.hcrh) {
        repoData.hcrh_repo = subFields.hcrh_repo;
      }
      if (platforms.cns) {
        repoData.cns_repo = subFields.cns_repo;
      }

      const serializedDemo = JSON.stringify(demoData);
      const serializedRepo = JSON.stringify(repoData);
      const aiTechnology = platforms.ai ? subFields.ai_tech : "";

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("big_idea", formData.big_idea);
      data.append("category", formData.category);
      data.append("frontend_demo", serializedDemo);
      data.append("repository", serializedRepo);
      data.append("ai_technology", aiTechnology);
      data.append("showcase_video", formData.showcase_video);
      data.append("batch", formData.batch);
      data.append("team_name", formData.team_name);
      data.append("is_published", String(formData.is_published));
      data.append("is_best_product", String(formData.is_best_product));
      data.append("genre", formData.genre);
      data.append("platforms", formData.platforms);

      data.append("team_members", JSON.stringify(teamMembers));

      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      if (isGameDev) {
        data.append("existing_screenshots", JSON.stringify(existingScreenshots));
        newScreenshotFiles.forEach((file) => {
          data.append("screenshots", file);
        });
      }

      if (isEditing && id) {
        await updateProject(Number(id), data);
      } else {
        await createProject(data);
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save project records.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#8A3DFF] animate-spin mb-3" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/projects")}
          className="w-10 h-10 rounded-full border border-border/50 bg-secondary/35 flex items-center justify-center text-foreground hover:bg-secondary transition-colors apple-press"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isEditing ? "Modify Project" : "Add New Project"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEditing ? "Edit existing exhibition project details" : "Register a new exhibition capstone"}
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-destructive text-xs flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-destructive/60 hover:text-destructive">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Step A: Basic Info */}
        <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">General Metadata</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. EcoTrack Dashboard"
                required
                className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">The Big Idea</label>
              <textarea
                value={formData.big_idea}
                onChange={(e) => setFormData({ ...formData, big_idea: e.target.value })}
                placeholder="What core issue does this prototype address?"
                rows={2}
                className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Break down features, UX structure, and workflows..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Merge category *</label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger className="w-full rounded-2xl bg-secondary/30 border-border/60 text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Cohort batch *</label>
              <Select
                value={formData.batch}
                onValueChange={(val) => setFormData({ ...formData, batch: val })}
              >
                <SelectTrigger className="w-full rounded-2xl bg-secondary/30 border-border/60 text-xs font-semibold">
                  <SelectValue placeholder="Choose Batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={String(b.batch_number)}>
                      Batch {b.batch_number} {b.is_active ? "(Active)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.category === "game_dev" && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Genre *</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="e.g. Action RPG, Platformer, Puzzle"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Platforms *</label>
                  <input
                    type="text"
                    value={formData.platforms}
                    onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
                    placeholder="e.g. Windows, Web, macOS"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step B: Team Details */}
        <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-[#8A3DFF]" />
              Team Roster Specifications *
            </h2>
            <button
              type="button"
              onClick={addTeamMember}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8A3DFF]/15 text-[#8A3DFF] hover:bg-[#8A3DFF]/25 transition-colors apple-press border border-[#8A3DFF]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Member
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {formData.category === "game_dev" ? "Studio Name *" : "Team Name *"}
              </label>
              <input
                type="text"
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                placeholder={formData.category === "game_dev" ? "e.g. Bangun Studio" : "e.g. Green Innovators"}
                required
                className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
              />
            </div>

            {teamMembers.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border/50 rounded-3xl">
                <Users className="w-10 h-10 text-muted-foreground/35 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground">Roster list is empty. Click "Add Member" to assign students.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-secondary/25 border border-border/50 flex flex-col gap-3 relative">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Name */}
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                        placeholder="Student name"
                        required
                        className="flex-1 min-w-[150px] px-3.5 py-2.5 rounded-xl bg-background border border-border/60 text-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
                      />

                      {/* Role */}
                      <Select
                        value={member.role}
                        onValueChange={(val) => updateTeamMember(index, "role", val)}
                      >
                        <SelectTrigger className="rounded-xl bg-background border-border/60 text-xs font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Program */}
                      <Select
                        value={member.program}
                        onValueChange={(val) => updateTeamMember(index, "program", val)}
                      >
                        <SelectTrigger className="rounded-xl bg-background border-border/60 text-xs font-semibold max-w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allPrograms.map((prog) => (
                            <SelectItem key={prog} value={prog}>
                              {programLabels[prog]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/25 transition-colors apple-press"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* LinkedIn Link */}
                    <div className="relative">
                      <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a66c2]" />
                      <input
                        type="url"
                        value={member.linkedin_url || ""}
                        onChange={(e) => updateTeamMember(index, "linkedin_url", e.target.value)}
                        placeholder="LinkedIn Profile URL (optional)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step C: Demo Links */}
        {(() => {
          const platforms = getActivePlatforms(formData.category);
          return (
            <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Demo & Video Links</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Showcase Video URL - Always Visible */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Showcase Video URL</label>
                  <input
                    type="url"
                    value={formData.showcase_video}
                    onChange={(e) => setFormData({ ...formData, showcase_video: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                  />
                </div>

                {/* Web Platform Fields */}
                {platforms.web && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Frontend Demo URL (Web)</label>
                      <input
                        type="url"
                        value={subFields.web_demo}
                        onChange={(e) => setSubFields({ ...subFields, web_demo: e.target.value })}
                        placeholder="https://exhibition-app.vercel.app"
                        className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">GitHub Web Repository</label>
                      <input
                        type="url"
                        value={subFields.web_repo}
                        onChange={(e) => setSubFields({ ...subFields, web_repo: e.target.value })}
                        placeholder="https://github.com/user/web-repo"
                        className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                      />
                    </div>
                  </>
                )}

                {/* Mobile Platform Fields */}
                {platforms.mobile && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">APK Download URL (Mobile)</label>
                      <input
                        type="url"
                        value={subFields.mobile_apk}
                        onChange={(e) => setSubFields({ ...subFields, mobile_apk: e.target.value })}
                        placeholder="https://link-to-apk-download.com"
                        className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">GitHub Mobile Repository</label>
                      <input
                        type="url"
                        value={subFields.mobile_repo}
                        onChange={(e) => setSubFields({ ...subFields, mobile_repo: e.target.value })}
                        placeholder="https://github.com/user/mobile-repo"
                        className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                      />
                    </div>
                  </>
                )}

                {/* AI Platform Fields */}
                {platforms.ai && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Hugging Face Hosting URL (AI)</label>
                      <input
                        type="url"
                        value={subFields.ai_huggingface}
                        onChange={(e) => setSubFields({ ...subFields, ai_huggingface: e.target.value })}
                        placeholder="https://huggingface.co/spaces/user/space"
                        className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">GitHub AI Repository</label>
                      <input
                        type="url"
                        value={subFields.ai_repo}
                        onChange={(e) => setSubFields({ ...subFields, ai_repo: e.target.value })}
                        placeholder="https://github.com/user/ai-repo"
                        className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Core AI / Algorithm Technology (comma-separated)</label>
                      <input
                        type="text"
                        value={subFields.ai_tech}
                        onChange={(e) => setSubFields({ ...subFields, ai_tech: e.target.value })}
                        placeholder="e.g. YOLOv8, OpenAI API, TensorFlow"
                        className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                      />
                    </div>
                  </>
                )}

                {/* Game Platform Fields */}
                {platforms.game && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Game Download URL</label>
                    <input
                      type="url"
                      value={subFields.game_download}
                      onChange={(e) => setSubFields({ ...subFields, game_download: e.target.value })}
                      placeholder="https://itch.io/game-slug or similar"
                      className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                    />
                  </div>
                )}

                {/* AAI Platform Fields */}
                {platforms.aai && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">GitHub AAI Repository</label>
                    <input
                      type="url"
                      value={subFields.aai_repo}
                      onChange={(e) => setSubFields({ ...subFields, aai_repo: e.target.value })}
                      placeholder="https://github.com/user/aai-repo"
                      className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                    />
                  </div>
                )}

                {/* HCRH Platform Fields */}
                {platforms.hcrh && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">GitHub HCRH Repository</label>
                    <input
                      type="url"
                      value={subFields.hcrh_repo}
                      onChange={(e) => setSubFields({ ...subFields, hcrh_repo: e.target.value })}
                      placeholder="https://github.com/user/hcrh-repo"
                      className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                    />
                  </div>
                )}

                {/* CNS Platform Fields */}
                {platforms.cns && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">GitHub CNS Repository</label>
                    <input
                      type="url"
                      value={subFields.cns_repo}
                      onChange={(e) => setSubFields({ ...subFields, cns_repo: e.target.value })}
                      placeholder="https://github.com/user/cns-repo"
                      className="w-full px-4 py-3 rounded-2xl bg-secondary/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Step D: Thumbnail Upload */}
        <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Thumbnail Image</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Preview Box */}
            <div className="w-48 h-32 rounded-2xl bg-secondary/30 border border-border/60 overflow-hidden flex items-center justify-center shrink-0">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground/35" />
              )}
            </div>

            {/* Input Trigger */}
            <div className="flex-1 w-full">
              <label className="block cursor-pointer">
                <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-border/60 hover:border-[#8A3DFF]/60 transition-colors bg-secondary/10 hover:bg-secondary/20">
                  <Upload className="w-6 h-6 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-foreground">Click to upload thumbnail</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PNG or JPEG, maximum 2MB size limit.</p>
                  </div>
                </div>
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {formData.category === "game_dev" && (
          <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gameplay Screenshots</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Existing Screenshots */}
              {existingScreenshots.map((url, idx) => (
                <div key={`existing-${idx}`} className="group relative aspect-video rounded-2xl border border-border/60 overflow-hidden bg-secondary/20">
                  <img src={url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || "https://api-exhibition.infinitelearningstudent.id"}${url}`} alt="Gameplay Screenshot" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setExistingScreenshots(existingScreenshots.filter((_, i) => i !== idx))}
                      className="p-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors apple-press"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* New Screenshots Previews */}
              {newScreenshotPreviews.map((preview, idx) => (
                <div key={`new-${idx}`} className="group relative aspect-video rounded-2xl border border-border/60 overflow-hidden bg-secondary/20">
                  <img src={preview} alt="Gameplay Screenshot Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setNewScreenshotFiles(newScreenshotFiles.filter((_, i) => i !== idx));
                        setNewScreenshotPreviews(newScreenshotPreviews.filter((_, i) => i !== idx));
                      }}
                      className="p-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors apple-press"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload Trigger Button if less than 10 total */}
              {(existingScreenshots.length + newScreenshotFiles.length) < 10 && (
                <label className="cursor-pointer aspect-video rounded-2xl border-2 border-dashed border-border/60 hover:border-[#8A3DFF]/60 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-all gap-1">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Add Screenshot</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const allowedCount = 10 - (existingScreenshots.length + newScreenshotFiles.length);
                      const filesToAdd = files.slice(0, allowedCount);
                      
                      const newFiles = [...newScreenshotFiles, ...filesToAdd];
                      setNewScreenshotFiles(newFiles);

                      const newPreviewsPromise = filesToAdd.map((file) => {
                        return new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onload = () => resolve(reader.result as string);
                          reader.readAsDataURL(file);
                        });
                      });

                      Promise.all(newPreviewsPromise).then((previews) => {
                        setNewScreenshotPreviews([...newScreenshotPreviews, ...previews]);
                      });
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">PNG or JPEG, maximum 10 screenshots allowed.</p>
          </div>
        )}

        {/* Step E: Publishing */}
        <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Visibility & Highlights</h2>
          
          <div className="flex flex-wrap gap-8 items-center">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-5 h-5 rounded border border-border text-[#8A3DFF] focus:ring-[#8A3DFF]/30 accent-[#8A3DFF]"
              />
              Publish Project
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={formData.is_best_product}
                onChange={(e) => setFormData({ ...formData, is_best_product: e.target.checked })}
                className="w-5 h-5 rounded border border-border text-[#8A3DFF] focus:ring-[#8A3DFF]/30 accent-[#8A3DFF]"
              />
              Mark as Best Product
            </label>

            {formData.is_best_product && (
              <span className="text-[11px] font-bold text-[#8A3DFF]">
                ✓ Project will feature in the main Best Products spotlight gallery.
              </span>
            )}
          </div>
        </div>

        {/* Submission Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? "Update Project" : "Register Project"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="px-6 py-3 rounded-full border border-border/60 bg-secondary/35 font-semibold text-xs hover:bg-secondary/60 transition-colors apple-press"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
