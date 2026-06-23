"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  FolderKanban,
  Loader2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Edit2
} from "lucide-react";
import { getAllTeams, createTeam, updateTeam, deleteTeam, type Team } from "@/lib/api/team.api";
import { getAllBatches, getActiveBatch, type Batch } from "@/lib/api/batch.api";
import { getAllProjects, type Project } from "@/lib/api/project.api";
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

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);

  // New team form
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamBatch, setNewTeamBatch] = useState("");
  const [newTeamProject, setNewTeamProject] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchTeams = async () => {
    try {
      const res = await getAllTeams(selectedBatch || undefined);
      setTeams(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to retrieve teams: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchesRes, projectsRes] = await Promise.all([
          getAllBatches(),
          getAllProjects(),
        ]);

        setBatches(batchesRes.data || []);
        setProjects(projectsRes.data || []);

        try {
          const activeRes = await getActiveBatch();
          setActiveBatch(activeRes.data);
          if (!selectedBatch) {
            setNewTeamBatch(String(activeRes.data.batch_number));
          }
        } catch {
          // No active batch
        }

        await fetchTeams();
      } catch (err: any) {
        console.error(err);
        setError(`Failed to load initial data: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedBatch]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamBatch) return;

    setIsSaving(true);
    try {
      const payload = {
        team_name: newTeamName,
        batch: Number(newTeamBatch),
        project_id: newTeamProject ? Number(newTeamProject) : undefined,
      };

      if (editingId) {
        await updateTeam(editingId, payload);
      } else {
        await createTeam(payload);
      }

      setNewTeamName("");
      setNewTeamProject("");
      setEditingId(null);
      setShowAddForm(false);
      await fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save team.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    setNewTeamName(team.team_name);
    setNewTeamBatch(String(team.batch));
    setNewTeamProject(team.project_id ? String(team.project_id) : "");
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setNewTeamName("");
    setNewTeamProject("");
    setShowAddForm(false);
  };

  const triggerDelete = (id: number) => {
    setTeamToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (teamToDelete === null) return;
    const id = teamToDelete;
    setTeamToDelete(null);
    setDeleteConfirmOpen(false);

    setActionLoading(id);
    try {
      await deleteTeam(id);
      await fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete team.");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#8A3DFF] animate-spin mb-3" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading Teams...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Project Teams</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage student project groupings
            {activeBatch && (
              <span className="ml-1 text-[#8A3DFF] font-medium">
                (Active: Batch {activeBatch.batch_number})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) resetForm();
            else setShowAddForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press"
        >
          {showAddForm ? "Close Form" : "Create Team"}
        </button>
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

      {/* Create Team Form Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateTeam} className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {editingId ? "Modify Team" : "Register Team"}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Team Name *</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. green-developers"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/35 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cohort Batch *</label>
                  <Select value={newTeamBatch} onValueChange={setNewTeamBatch}>
                    <SelectTrigger className="w-full rounded-xl bg-secondary/35 border-border/60 text-xs font-semibold">
                      <SelectValue placeholder="Select Batch" />
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

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Assigned Project</label>
                  <Select value={newTeamProject || "none"} onValueChange={(val) => setNewTeamProject(val === "none" ? "" : val)}>
                    <SelectTrigger className="w-full rounded-xl bg-secondary/35 border-border/60 text-xs font-semibold">
                      <SelectValue placeholder="No Project Assigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Project Assigned</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingId ? "Update Team" : "Save Team"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-full border border-border/60 bg-secondary/35 font-semibold text-xs hover:bg-secondary/60 transition-colors apple-press"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <Select
          value={selectedBatch ? String(selectedBatch) : "active"}
          onValueChange={(val) =>
            setSelectedBatch(val === "active" ? null : Number(val))
          }
        >
          <SelectTrigger className="w-52 rounded-full bg-secondary/35 border-border/60 text-xs font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active Batch Only</SelectItem>
            {batches.map((b) => (
              <SelectItem key={b.id} value={String(b.batch_number)}>
                Batch {b.batch_number} ({b.name || "Unnamed"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Teams Grid List */}
      {teams.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-3xl">
          <Users className="w-12 h-12 text-[#8A3DFF]/30 mx-auto mb-4" />
          <h3 className="text-base font-bold mb-1">No Teams Found</h3>
          <p className="text-xs text-muted-foreground">Register your first team cohort to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <motion.div key={team.id} whileHover={{ y: -2 }}>
              <div className="glass rounded-3xl p-6 border border-border/50 hover:border-[#8A3DFF]/30 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-border/20 pb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-secondary/80 text-foreground border border-border/50">
                      <Layers className="w-3 h-3 text-[#8A3DFF]" />
                      Batch {team.batch}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(team)}
                        className="p-2 rounded-xl text-muted-foreground hover:bg-secondary/60 hover:text-[#8A3DFF] border border-transparent transition-colors apple-press"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerDelete(team.id)}
                        disabled={actionLoading === team.id}
                        className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive border border-transparent transition-colors apple-press"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-foreground mb-3">{team.team_name}</h3>

                  {team.project_title ? (
                    <div className="flex items-start gap-2 bg-secondary/20 p-3 rounded-2xl border border-border/40 mb-4">
                      <FolderKanban className="w-4 h-4 text-[#8A3DFF] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Assigned Project:</span>
                        <span className="text-xs font-semibold text-foreground line-clamp-1 mt-0.5">{team.project_title}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 bg-secondary/10 p-3 rounded-2xl border border-border/30 border-dashed mb-4">
                      <FolderKanban className="w-4 h-4 text-muted-foreground/45 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Assigned Project:</span>
                        <span className="text-xs text-muted-foreground italic mt-0.5">No project assigned yet</span>
                      </div>
                    </div>
                  )}

                  {/* Members roster preview */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">Members ({team.members?.length || 0}):</span>
                    {team.members && team.members.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {team.members.map((m) => (
                          <span
                            key={m.id}
                            className="inline-flex px-2 py-1 rounded-lg bg-secondary/35 border border-border/50 text-[10px] font-semibold text-foreground"
                            title={`${m.name} - ${m.role}`}
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">No student members registered.</p>
                    )}
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
              This action cannot be undone. This will permanently delete the team profile. Assigned student mentees will be unlinked.
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
