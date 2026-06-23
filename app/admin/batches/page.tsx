"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  X,
  Calendar,
  Eye,
  Edit2
} from "lucide-react";
import {
  getAllBatches,
  createBatch,
  updateBatch,
  activateBatch,
  deleteBatch,
  type Batch
} from "@/lib/api/batch.api";
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

export default function AdminBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<number | null>(null);

  // New batch form state
  const [newBatchNumber, setNewBatchNumber] = useState("");
  const [newBatchName, setNewBatchName] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBatches = async () => {
    try {
      const res = await getAllBatches();
      setBatches(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to retrieve cohorts: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    fetchBatches().finally(() => setIsLoading(false));
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchNumber) return;

    setIsSaving(true);
    try {
      const payload = {
        batch_number: Number(newBatchNumber),
        name: newBatchName || `Batch ${newBatchNumber}`,
        start_date: newStartDate || undefined,
        end_date: newEndDate || undefined,
      };

      if (editingId) {
        await updateBatch(editingId, payload);
      } else {
        await createBatch(payload);
      }

      setNewBatchNumber("");
      setNewBatchName("");
      setNewStartDate("");
      setNewEndDate("");
      setEditingId(null);
      setShowAddForm(false);
      await fetchBatches();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save cohort batch.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingId(batch.id);
    setNewBatchNumber(String(batch.batch_number));
    setNewBatchName(batch.name || "");
    setNewStartDate(batch.start_date ? batch.start_date.split("T")[0] : "");
    setNewEndDate(batch.end_date ? batch.end_date.split("T")[0] : "");
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setNewBatchNumber("");
    setNewBatchName("");
    setNewStartDate("");
    setNewEndDate("");
    setShowAddForm(false);
  };

  const handleActivate = async (id: number) => {
    setActionLoading(id);
    try {
      await activateBatch(id);
      await fetchBatches();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to activate batch.");
    } finally {
      setActionLoading(null);
    }
  };

  const triggerDelete = (id: number) => {
    setBatchToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (batchToDelete === null) return;
    const id = batchToDelete;
    setBatchToDelete(null);
    setDeleteConfirmOpen(false);

    setActionLoading(id);
    try {
      await deleteBatch(id);
      await fetchBatches();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete batch.");
    } finally {
      setActionLoading(null);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#8A3DFF] animate-spin mb-3" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading Cohorts...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Cohort Batches</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage learning cohorts timeline and statuses.</p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) resetForm();
            else setShowAddForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press"
        >
          {showAddForm ? "Close Form" : "Create Batch"}
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

      {/* New Batch registration Form Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateBatch} className="glass rounded-3xl p-6 border border-border/50 flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {editingId ? "Modify Cohort Batch" : "Register Cohort Batch"}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Batch Number *</label>
                  <input
                    type="number"
                    value={newBatchNumber}
                    onChange={(e) => setNewBatchNumber(e.target.value)}
                    placeholder="e.g. 9"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-secondary/35 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Batch Name</label>
                  <input
                    type="text"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    placeholder="e.g. Batch 9 - Spark"
                    className="w-full px-3 py-2 rounded-xl bg-secondary/35 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/35 border border-border/60 text-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/35 border border-border/60 text-foreground focus:outline-none focus:border-[#8A3DFF]/60 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-full bg-[#8A3DFF] text-white font-semibold text-xs transition-colors hover:bg-[#A366FF] glow-accent apple-press disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingId ? "Update Batch" : "Save Batch"}
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

      {/* Cohorts listing table */}
      <div className="glass rounded-3xl overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/20 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 pl-6">Batch ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Timeline</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-xs">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="p-4 pl-6 font-bold text-foreground">Batch {batch.batch_number}</td>
                  <td className="p-4 text-muted-foreground font-medium">{batch.name || "Unnamed"}</td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8A3DFF]/70" />
                      {batch.start_date ? new Date(batch.start_date).toLocaleDateString() : "-"}
                      <span className="opacity-40">to</span>
                      {batch.end_date ? new Date(batch.end_date).toLocaleDateString() : "-"}
                    </div>
                  </td>
                  <td className="p-4">
                    {batch.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/15">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-500/10 text-muted-foreground border border-border/50">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!batch.is_active && (
                        <button
                          onClick={() => handleActivate(batch.id)}
                          disabled={actionLoading === batch.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase bg-[#8A3DFF]/15 text-[#8A3DFF] hover:bg-[#8A3DFF]/25 border border-[#8A3DFF]/20 transition-all apple-press disabled:opacity-50"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(batch)}
                        className="p-2 rounded-xl bg-secondary/40 border border-border/50 text-muted-foreground hover:text-[#8A3DFF] hover:border-[#8A3DFF]/30 transition-all apple-press"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerDelete(batch.id)}
                        disabled={actionLoading === batch.id || batch.is_active}
                        className="p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all apple-press disabled:opacity-30 disabled:pointer-events-none"
                        title="Only inactive cohorts can be deleted"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                    No batches listed. Click "Create Batch" to start tracking student groups.
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
              This action cannot be undone. This will permanently delete the batch. All assigned projects and teams might be unlinked.
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
