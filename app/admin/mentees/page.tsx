"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Wait, do not use react-redux, import from framer-motion!
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Linkedin,
  Loader2,
  AlertCircle,
  X,
  Search,
  Filter,
  CheckCircle,
  GraduationCap
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
  getAllMentees,
  createMentee,
  updateMentee,
  deleteMentee,
  roleLabels,
  allRoles,
  programLabels,
  allPrograms,
  type Mentee,
  type MenteeRole,
  type MenteeProgram
} from "@/lib/api/mentee.api";
import { getAllTeams, type Team } from "@/lib/api/team.api";
import { getAllBatches, getActiveBatch, type Batch } from "@/lib/api/batch.api";

export default function AdminMentees() {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [menteeToDelete, setMenteeToDelete] = useState<number | null>(null);
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);

  // Filters
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formBatch, setFormBatch] = useState("");
  const [formTeam, setFormTeam] = useState("");
  const [formRole, setFormRole] = useState<MenteeRole>("hacker");
  const [formProgram, setFormProgram] = useState<MenteeProgram>("web_uiux");
  const [formIsScrumMaster, setFormIsScrumMaster] = useState(false);
  const [formLinkedin, setFormLinkedin] = useState("");

  const fetchMenteesAndTeams = async () => {
    try {
      const [menteesRes, teamsRes] = await Promise.all([
        getAllMentees(selectedBatch ? { batch: selectedBatch } : undefined),
        getAllTeams(),
      ]);
      setMentees(menteesRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to retrieve students roster: ${err.response?.data?.message || err.message}`);
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
          if (!selectedBatch) {
            setFormBatch(String(activeRes.data.batch_number));
          }
        } catch {
          // No active batch
        }

        await fetchMenteesAndTeams();
      } catch (err: any) {
        console.error(err);
        setError(`Failed to load initial mentees database: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedBatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBatch) return;

    setIsSaving(true);
    try {
      const payload = {
        name: formName,
        batch: Number(formBatch),
        team_id: formTeam ? Number(formTeam) : undefined,
        role: formRole,
        program: formProgram,
        is_scrum_master: formIsScrumMaster,
        linkedin_url: formLinkedin || undefined,
      };

      if (editingId) {
        await updateMentee(editingId, payload);
      } else {
        await createMentee(payload);
      }

      // Reset
      resetForm();
      await fetchMenteesAndTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save student profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setFormTeam("");
    setFormRole("hacker");
    setFormProgram("web_uiux");
    setFormIsScrumMaster(false);
    setFormLinkedin("");
    setShowForm(false);
  };

  const handleEdit = (m: Mentee) => {
    setEditingId(m.id);
    setFormName(m.name);
    setFormBatch(String(m.batch));
    setFormTeam(m.team_id ? String(m.team_id) : "");
    setFormRole(m.role);
    setFormProgram(m.program || "web_uiux");
    setFormIsScrumMaster(m.is_scrum_master);
    setFormLinkedin(m.linkedin_url || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerDelete = (id: number) => {
    setMenteeToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (menteeToDelete === null) return;
    const id = menteeToDelete;
    setMenteeToDelete(null);
    setDeleteConfirmOpen(false);

    setActionLoading(id);
    try {
      await deleteMentee(id);
      await fetchMenteesAndTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete student.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredMentees = mentees.filter((m) => {
    return (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#8A3DFF] animate-spin mb-3" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading student list...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Student Mentees</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage students profile, assigned projects, and roles.
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press"
        >
          {showForm ? "Close Form" : "Add Student"}
        </button>
      </div>

      {/* Error Info Banner */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-destructive text-xs flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-destructive/60 hover:text-destructive">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Dialog Sheet */}
      {showForm && (
        <div className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {editingId ? "Modify Student Profile" : "Register Student"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Full Name *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. John Doe"
                required
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/35 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Cohort Batch *</label>
              <Select value={formBatch} onValueChange={setFormBatch}>
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Assigned Team</label>
              <Select value={formTeam || "none"} onValueChange={(val) => setFormTeam(val === "none" ? "" : val)}>
                <SelectTrigger className="w-full rounded-xl bg-secondary/35 border-border/60 text-xs font-semibold">
                  <SelectValue placeholder="No Team Assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Team Assigned</SelectItem>
                  {teams
                    .filter((t) => !formBatch || t.batch === Number(formBatch))
                    .map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.team_name} (Batch {t.batch})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Hustler/Hacker/Hipster Role</label>
              <Select value={formRole} onValueChange={(val) => setFormRole(val as MenteeRole)}>
                <SelectTrigger className="w-full rounded-xl bg-secondary/35 border-border/60 text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Learning Track Program</label>
              <Select value={formProgram} onValueChange={(val) => setFormProgram(val as MenteeProgram)}>
                <SelectTrigger className="w-full rounded-xl bg-secondary/35 border-border/60 text-xs font-semibold">
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
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={formLinkedin}
                onChange={(e) => setFormLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/35 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3 flex items-center justify-between pt-2 border-t border-border/30 mt-2">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={formIsScrumMaster}
                  onChange={(e) => setFormIsScrumMaster(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border border-border text-[#8A3DFF] focus:ring-[#8A3DFF]/30 accent-[#8A3DFF]"
                />
                Mark as Scrum Master
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingId ? "Update Student" : "Save Student"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-full border border-border/60 bg-secondary/35 font-semibold text-xs hover:bg-secondary/60 transition-colors apple-press"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Roster Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student names, roles, or team names..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-secondary/35 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 focus:ring-4 focus:ring-[#8A3DFF]/10 transition-all text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4.5 h-4.5 text-muted-foreground" />
          <Select
            value={selectedBatch ? String(selectedBatch) : "all"}
            onValueChange={(val) =>
              setSelectedBatch(val === "all" ? null : Number(val))
            }
          >
            <SelectTrigger className="w-48 rounded-full bg-secondary/35 border-border/60 text-xs font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((b) => (
                <SelectItem key={b.id} value={String(b.batch_number)}>
                  Batch {b.batch_number} ({b.name || "Unnamed"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Roster list count */}
      <div className="text-xs font-semibold text-muted-foreground border-b border-border/50 pb-4">
        Showing {filteredMentees.length} registered students
      </div>

      {/* Mentees Table Roster */}
      <div className="glass rounded-3xl overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/20 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 pl-6">Student Name</th>
                <th className="p-4">Track Program</th>
                <th className="p-4">Assigned Team</th>
                <th className="p-4">Exposition Role</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-xs">
              {filteredMentees.map((mentee) => (
                <tr key={mentee.id} className="hover:bg-secondary/10 transition-colors">
                  {/* Name */}
                  <td className="p-4 pl-6 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      {mentee.name}
                      {mentee.is_scrum_master && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-amber-500 text-black uppercase">
                          SM
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Program */}
                  <td className="p-4 text-muted-foreground font-medium">
                    {mentee.program ? programLabels[mentee.program] : "General Program"}
                  </td>
                  {/* Team */}
                  <td className="p-4 text-muted-foreground">
                    {mentee.team_name ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#8A3DFF]">
                        {mentee.team_name}
                      </span>
                    ) : (
                      <span className="opacity-40 italic">Not Assigned</span>
                    )}
                  </td>
                  {/* Role */}
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-secondary border border-border/50">
                      {roleLabels[mentee.role] || mentee.role}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {mentee.linkedin_url && (
                        <a
                          href={mentee.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-secondary/40 border border-border/50 text-muted-foreground hover:text-[#0a66c2] transition-colors apple-press"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(mentee)}
                        className="p-2 rounded-xl bg-secondary/40 border border-border/50 text-muted-foreground hover:text-[#8A3DFF] hover:border-[#8A3DFF]/30 transition-all apple-press"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerDelete(mentee.id)}
                        disabled={actionLoading === mentee.id}
                        className="p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all apple-press"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMentees.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                    No students listed matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student profile from the database.
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
