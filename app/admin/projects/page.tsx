"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
  Trash2,
  Edit2,
  ExternalLink,
  AlertCircle,
  X,
  Users,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getProjectsByActiveBatch,
  getAllProjects,
  deleteProject,
  publishProject,
  setBestProduct,
  categoryLabels,
  type ProjectCategory,
  type Project,
  getPrimaryDemoUrl
} from "@/lib/api/project.api";
import { getAllBatches, getActiveBatch, type Batch } from "@/lib/api/batch.api";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const fetchProjects = async () => {
    try {
      const projectsRes = selectedBatch
        ? await getAllProjects(selectedBatch)
        : await getProjectsByActiveBatch();
      setProjects(projectsRes.data || []);
    } catch (err: any) {
      console.error(err);
      try {
        const res = await getAllProjects();
        setProjects(res.data || []);
      } catch (innerErr: any) {
        setError(`Failed to load projects: ${innerErr.response?.data?.message || innerErr.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchesRes = await getAllBatches();
        setBatches(batchesRes.data || []);

        try {
          const activeRes = await getActiveBatch();
          setActiveBatch(activeRes.data);
        } catch {
          // No active batch
        }

        await fetchProjects();
      } catch (err: any) {
        console.error(err);
        setError(`Failed to load project database: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedBatch]);

  const handlePublish = async (id: number, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      await publishProject(id, !currentStatus);
      await fetchProjects();
    } catch (err) {
      console.error(err);
      setError("Failed to change publish status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBestProduct = async (id: number, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      await setBestProduct(id, !currentStatus);
      await fetchProjects();
    } catch (err) {
      console.error(err);
      setError("Failed to change best product status");
    } finally {
      setActionLoading(null);
    }
  };

  const triggerDelete = (id: number) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (projectToDelete === null) return;
    const id = projectToDelete;
    setProjectToDelete(null);
    setDeleteConfirmOpen(false);

    setActionLoading(id);
    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#8A3DFF] animate-spin mb-3" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading Projects...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Projects Roster</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage exhibition projects
            {activeBatch && (
              <span className="ml-1 text-[#8A3DFF] font-medium">
                (Active: Batch {activeBatch.batch_number})
              </span>
            )}
          </p>
        </div>
        <Link href="/admin/projects/new">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </Link>
      </div>

      {/* Error Info Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-destructive text-xs flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-destructive/60 hover:text-destructive">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Options */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-secondary/35 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4.5 h-4.5 text-muted-foreground" />
          <Select
            value={selectedBatch ? String(selectedBatch) : "active"}
            onValueChange={(val) =>
              setSelectedBatch(val === "active" ? null : Number(val))
            }
          >
            <SelectTrigger className="w-48 rounded-full bg-secondary/35 border-border/60 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Batch Only</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={String(batch.batch_number)}>
                  Batch {batch.batch_number} ({batch.name || "Unnamed"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Numerical Stats overview */}
      <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground border-b border-border/50 pb-4">
        <span>Total Count: {filteredProjects.length}</span>
        <span className="opacity-30">|</span>
        <span className="text-green-500">Published: {filteredProjects.filter((p) => p.is_published).length}</span>
        <span className="opacity-30">|</span>
        <span className="text-yellow-500">Best Products: {filteredProjects.filter((p) => p.is_best_product).length}</span>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/50 rounded-3xl">
          <FolderKanban className="w-12 h-12 text-[#8A3DFF]/30 mx-auto mb-4" />
          <h3 className="text-base font-bold mb-1">No Projects Found</h3>
          <p className="text-xs text-muted-foreground">Try adjusting search parameters or create a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div key={project.id} whileHover={{ y: -2 }}>
              <div
                className={`glass rounded-3xl overflow-hidden h-full flex flex-col hover:border-[#8A3DFF]/30 transition-all duration-300 ${
                  project.is_best_product ? "border-yellow-500/30 shadow-md shadow-yellow-500/5" : ""
                }`}
              >
                {/* Image */}
                <div className="relative h-40 bg-secondary/50">
                  {project.thumbnail ? (
                    <img
                      src={
                        project.thumbnail.startsWith("http")
                          ? project.thumbnail
                          : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"}${project.thumbnail}`
                      }
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.is_best_product && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-yellow-500 text-black border-0">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Best
                      </span>
                    )}
                    {!project.is_published && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-500 text-white border-0">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Category Overlay */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white border-0">
                      {categoryLabels[project.category as ProjectCategory] || "Web Development"}
                    </span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex-grow mb-4">
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {project.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      {project.team_name && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <Users className="w-3 h-3 text-[#8A3DFF]" />
                          {project.team_name}
                        </span>
                      )}
                      {project.batch && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary/80 text-foreground border border-border/50">
                          Batch {project.batch}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action items Row */}
                  <div className="pt-4 border-t border-border/40 flex items-center gap-2">
                    {/* Publish */}
                    <button
                      onClick={() => handlePublish(project.id, project.is_published)}
                      disabled={actionLoading === project.id}
                      className={`p-2 rounded-xl transition-colors ${
                        project.is_published
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                          : "bg-secondary/40 text-muted-foreground hover:bg-secondary border border-border/50"
                      } apple-press`}
                      title={project.is_published ? "Unpublish" : "Publish"}
                    >
                      {actionLoading === project.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : project.is_published ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Best */}
                    <button
                      onClick={() => handleBestProduct(project.id, !!project.is_best_product)}
                      disabled={actionLoading === project.id}
                      className={`p-2 rounded-xl transition-colors ${
                        project.is_best_product
                          ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20"
                          : "bg-secondary/40 text-muted-foreground hover:bg-secondary border border-border/50"
                      } apple-press`}
                      title={project.is_best_product ? "Remove Best" : "Mark Best"}
                    >
                      <Star className={`w-3.5 h-3.5 ${project.is_best_product ? "fill-current" : ""}`} />
                    </button>

                    {/* External Link */}
                    {getPrimaryDemoUrl(project.frontend_demo) && (
                      <a
                        href={getPrimaryDemoUrl(project.frontend_demo)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-secondary/40 border border-border/50 text-muted-foreground hover:text-foreground transition-all apple-press"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <div className="flex-grow" />

                    {/* Edit */}
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <button className="p-2 rounded-xl bg-secondary/40 border border-border/50 text-muted-foreground hover:text-[#8A3DFF] hover:border-[#8A3DFF]/30 transition-all apple-press">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => triggerDelete(project.id)}
                      disabled={actionLoading === project.id}
                      className="p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all apple-press"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project from the exhibition database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
