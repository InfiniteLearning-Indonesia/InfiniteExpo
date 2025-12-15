import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getAllBatches,
    createBatch,
    updateBatch,
    activateBatch,
    deleteBatch,
    type Batch,
} from "../../api/batch.api";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
    Layers,
    Plus,
    Check,
    X,
    Edit2,
    Trash2,
    Loader2,
    AlertCircle,
    Calendar,
    Power,
} from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

interface BatchFormData {
    batch_number: string;
    name: string;
    start_date: string;
    end_date: string;
}

const initialFormData: BatchFormData = {
    batch_number: "",
    name: "",
    start_date: "",
    end_date: "",
};

export default function AdminBatches() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<BatchFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBatches = async () => {
        try {
            const res = await getAllBatches();
            setBatches(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load batches");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.batch_number) return;

        setIsSubmitting(true);
        try {
            if (editingId) {
                await updateBatch(editingId, {
                    batch_number: Number(formData.batch_number),
                    name: formData.name,
                    start_date: formData.start_date || undefined,
                    end_date: formData.end_date || undefined,
                });
            } else {
                await createBatch({
                    batch_number: Number(formData.batch_number),
                    name: formData.name || `Batch ${formData.batch_number}`,
                    start_date: formData.start_date || undefined,
                    end_date: formData.end_date || undefined,
                });
            }
            await fetchBatches();
            resetForm();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to save batch");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleActivate = async (id: number) => {
        try {
            await activateBatch(id);
            await fetchBatches();
        } catch (err) {
            console.error(err);
            setError("Failed to activate batch");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this batch?")) return;
        try {
            await deleteBatch(id);
            await fetchBatches();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to delete batch");
        }
    };

    const startEdit = (batch: Batch) => {
        setEditingId(batch.id);
        setFormData({
            batch_number: String(batch.batch_number),
            name: batch.name || "",
            start_date: batch.start_date?.split("T")[0] || "",
            end_date: batch.end_date?.split("T")[0] || "",
        });
        setShowAddForm(true);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingId(null);
        setShowAddForm(false);
        setError(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#8A3DFF] animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">Batches</h1>
                    <p className="text-muted-foreground">
                        Manage exhibition batches and activation
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-accent rounded-xl font-medium text-white glow-accent"
                >
                    <Plus className="w-5 h-5" />
                    Add Batch
                </motion.button>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-400 text-sm flex-1">{error}</p>
                        <button onClick={() => setError(null)}>
                            <X className="w-4 h-4 text-red-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                    >
                        <Card className="bg-card border-white/10">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    {editingId ? "Edit Batch" : "Add New Batch"}
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Batch Number *
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.batch_number}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, batch_number: e.target.value })
                                                }
                                                placeholder="e.g., 9"
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                placeholder="e.g., Batch 9"
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.start_date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, start_date: e.target.value })
                                                }
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.end_date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, end_date: e.target.value })
                                                }
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-[#8A3DFF] rounded-xl font-medium text-white disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            )}
                                            {editingId ? "Update" : "Create"}
                                        </motion.button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Batches List */}
            <div className="space-y-4">
                {batches.length === 0 ? (
                    <Card className="bg-card border-white/5">
                        <CardContent className="p-12 text-center">
                            <Layers className="w-12 h-12 text-[#8A3DFF]/30 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No batches yet</h3>
                            <p className="text-muted-foreground">
                                Create your first batch to get started
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    batches.map((batch) => (
                        <motion.div key={batch.id} variants={fadeInUp}>
                            <Card
                                className={`bg-card border-white/5 hover:border-[#8A3DFF]/30 transition-all ${batch.is_active ? "border-green-500/30 bg-green-500/5" : ""
                                    }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-14 h-14 rounded-xl flex items-center justify-center ${batch.is_active
                                                        ? "bg-green-500/20"
                                                        : "bg-[#8A3DFF]/10"
                                                    }`}
                                            >
                                                <span
                                                    className={`text-xl font-bold ${batch.is_active ? "text-green-400" : "text-[#8A3DFF]"
                                                        }`}
                                                >
                                                    {batch.batch_number}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">
                                                        {batch.name || `Batch ${batch.batch_number}`}
                                                    </h3>
                                                    {batch.is_active && (
                                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>
                                                {(batch.start_date || batch.end_date) && (
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {batch.start_date
                                                            ? new Date(batch.start_date).toLocaleDateString()
                                                            : "—"}{" "}
                                                        -{" "}
                                                        {batch.end_date
                                                            ? new Date(batch.end_date).toLocaleDateString()
                                                            : "—"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!batch.is_active && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleActivate(batch.id)}
                                                    className="p-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                    title="Activate Batch"
                                                >
                                                    <Power className="w-5 h-5" />
                                                </motion.button>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => startEdit(batch)}
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(batch.id)}
                                                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
