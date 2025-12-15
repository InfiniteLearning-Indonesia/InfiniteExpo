import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getAllMentees,
    updateMentee,
    deleteMentee,
    createMentee,
    roleLabels,
    programLabels,
    allRoles,
    allPrograms,
    type Mentee,
    type MenteeRole,
    type MenteeProgram,
} from "../../api/mentee.api";
import { getAllTeams, type Team } from "../../api/team.api";
import { getAllBatches, type Batch } from "../../api/batch.api";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    GraduationCap,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    X,
    Plus,
    Check,
    Trash2,
    Crown,
    Edit2,
    Save,
} from "lucide-react";

const roleColors: Record<string, string> = {
    hustler: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hacker: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    design_researcher: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    data_engineer: "bg-green-500/20 text-green-400 border-green-500/30",
    ml_engineer: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    ml_ops: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const programColors: Record<string, string> = {
    web_uiux: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    mobile_flutter: "bg-green-500/10 text-green-400 border-green-500/20",
    ai_development: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    game_development: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface EditingMentee {
    id: number;
    name: string;
    role: MenteeRole;
    program: MenteeProgram;
    team_id: number | null;
    is_scrum_master: boolean;
}

export default function AdminMentees() {
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<EditingMentee | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMentee, setNewMentee] = useState({
        name: "",
        batch: "",
        team_id: "",
        role: "hacker" as MenteeRole,
        program: "web_uiux" as MenteeProgram,
        is_scrum_master: false,
    });
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        try {
            const [menteesRes, teamsRes, batchesRes] = await Promise.all([
                getAllMentees({ batch: selectedBatch || undefined }),
                getAllTeams(),
                getAllBatches(),
            ]);
            setMentees(menteesRes.data);
            setTeams(teamsRes.data);
            setBatches(batchesRes.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load mentees");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBatch]);

    const startEdit = (mentee: Mentee) => {
        setEditingId(mentee.id);
        setEditData({
            id: mentee.id,
            name: mentee.name,
            role: mentee.role,
            program: mentee.program || "web_uiux",
            team_id: mentee.team_id,
            is_scrum_master: mentee.is_scrum_master,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const saveEdit = async () => {
        if (!editData) return;

        setIsSaving(true);
        try {
            await updateMentee(editData.id, {
                name: editData.name,
                role: editData.role,
                program: editData.program,
                team_id: editData.team_id || undefined,
                is_scrum_master: editData.is_scrum_master,
            });
            await fetchData();
            cancelEdit();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to update mentee");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this mentee?")) return;
        try {
            await deleteMentee(id);
            await fetchData();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to delete mentee");
        }
    };

    const handleAddMentee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMentee.name || !newMentee.batch) return;

        setIsSaving(true);
        try {
            await createMentee({
                name: newMentee.name,
                batch: Number(newMentee.batch),
                team_id: newMentee.team_id ? Number(newMentee.team_id) : undefined,
                role: newMentee.role,
                program: newMentee.program,
                is_scrum_master: newMentee.is_scrum_master,
            });
            await fetchData();
            setShowAddForm(false);
            setNewMentee({
                name: "",
                batch: "",
                team_id: "",
                role: "hacker",
                program: "web_uiux",
                is_scrum_master: false,
            });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to add mentee");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredMentees = mentees.filter((mentee) =>
        mentee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            className="max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">Mentees</h1>
                    <p className="text-muted-foreground">
                        Manage mentees and their roles
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-accent rounded-xl font-medium text-white glow-accent"
                >
                    <Plus className="w-5 h-5" />
                    Add Mentee
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

            {/* Add Form */}
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
                                <h3 className="text-lg font-semibold mb-4">Add New Mentee</h3>
                                <form onSubmit={handleAddMentee} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newMentee.name}
                                                onChange={(e) =>
                                                    setNewMentee({ ...newMentee, name: e.target.value })
                                                }
                                                placeholder="Mentee name"
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20"
                                                required
                                            />
                                        </div>

                                        {/* Batch */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Batch *
                                            </label>
                                            <Select
                                                value={newMentee.batch}
                                                onValueChange={(value) =>
                                                    setNewMentee({ ...newMentee, batch: value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Batch" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {batches.map((batch) => (
                                                        <SelectItem
                                                            key={batch.id}
                                                            value={String(batch.batch_number)}
                                                        >
                                                            Batch {batch.batch_number}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Program */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Program *
                                            </label>
                                            <Select
                                                value={newMentee.program}
                                                onValueChange={(value) =>
                                                    setNewMentee({ ...newMentee, program: value as MenteeProgram })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Program" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allPrograms.map((program) => (
                                                        <SelectItem key={program} value={program}>
                                                            {programLabels[program]}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Role */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Role
                                            </label>
                                            <Select
                                                value={newMentee.role}
                                                onValueChange={(value) =>
                                                    setNewMentee({
                                                        ...newMentee,
                                                        role: value as MenteeRole,
                                                        is_scrum_master: value === "hustler" ? false : newMentee.is_scrum_master,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Role" />
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

                                        {/* Team */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Team (Optional)
                                            </label>
                                            <Select
                                                value={newMentee.team_id || "none"}
                                                onValueChange={(value) =>
                                                    setNewMentee({ ...newMentee, team_id: value === "none" ? "" : value })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="No Team" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No Team</SelectItem>
                                                    {teams.map((team) => (
                                                        <SelectItem key={team.id} value={String(team.id)}>
                                                            {team.team_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Scrum Master */}
                                        <div className="flex items-end">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={newMentee.is_scrum_master}
                                                    onChange={(e) =>
                                                        setNewMentee({
                                                            ...newMentee,
                                                            is_scrum_master: e.target.checked,
                                                        })
                                                    }
                                                    disabled={newMentee.role === "hustler"}
                                                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#8A3DFF]"
                                                />
                                                <span className="text-sm">Scrum Master</span>
                                                <Crown className="w-4 h-4 text-yellow-400" />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <motion.button
                                            type="submit"
                                            disabled={isSaving}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-[#8A3DFF] rounded-xl font-medium text-white disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            )}
                                            Add Mentee
                                        </motion.button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10"
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <Select
                        value={selectedBatch ? String(selectedBatch) : "all"}
                        onValueChange={(value) =>
                            setSelectedBatch(value === "all" ? null : Number(value))
                        }
                    >
                        <SelectTrigger className="min-w-[150px]">
                            <SelectValue placeholder="All Batches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Batches</SelectItem>
                            {batches.map((batch) => (
                                <SelectItem key={batch.id} value={String(batch.batch_number)}>
                                    Batch {batch.batch_number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total: {filteredMentees.length} mentees</span>
            </div>

            {/* Mentees Table */}
            <Card className="bg-card border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                                    Program
                                </th>
                                <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                                    Role
                                </th>
                                <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                                    Team
                                </th>
                                <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                                    Batch
                                </th>
                                <th className="text-right px-6 py-4 font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMentees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[#8A3DFF]/30" />
                                        <p className="text-muted-foreground">No mentees found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredMentees.map((mentee) => (
                                    <tr
                                        key={mentee.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        {/* Name */}
                                        <td className="px-6 py-4">
                                            {editingId === mentee.id ? (
                                                <input
                                                    type="text"
                                                    value={editData?.name || ""}
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData!,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/20 focus:border-[#8A3DFF]/50 focus:outline-none"
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2" title={mentee.is_scrum_master ? "Scrum Master" : ""}>
                                                    <span className="font-medium">{mentee.name}</span>
                                                    {mentee.is_scrum_master && (
                                                        <Crown className="w-4 h-4 text-yellow-400" />
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* Program */}
                                        <td className="px-6 py-4">
                                            {editingId === mentee.id ? (
                                                <Select
                                                    value={editData?.program || "web_uiux"}
                                                    onValueChange={(value) =>
                                                        setEditData({
                                                            ...editData!,
                                                            program: value as MenteeProgram,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allPrograms.map((program) => (
                                                            <SelectItem key={program} value={program}>
                                                                {programLabels[program]}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge
                                                    className={
                                                        programColors[mentee.program || "web_uiux"] ||
                                                        "bg-white/10 text-muted-foreground"
                                                    }
                                                >
                                                    {programLabels[mentee.program as MenteeProgram] || "Web Development"}
                                                </Badge>
                                            )}
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            {editingId === mentee.id ? (
                                                <Select
                                                    value={editData?.role || "hacker"}
                                                    onValueChange={(value) =>
                                                        setEditData({
                                                            ...editData!,
                                                            role: value as MenteeRole,
                                                            is_scrum_master: value === "hustler" ? false : editData!.is_scrum_master,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-[160px]">
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
                                            ) : (
                                                <Badge
                                                    className={
                                                        roleColors[mentee.role] ||
                                                        "bg-white/10 text-muted-foreground"
                                                    }
                                                >
                                                    {roleLabels[mentee.role] || mentee.role}
                                                </Badge>
                                            )}
                                        </td>

                                        {/* Team */}
                                        <td className="px-6 py-4">
                                            {editingId === mentee.id ? (
                                                <Select
                                                    value={editData?.team_id ? String(editData.team_id) : "none"}
                                                    onValueChange={(value) =>
                                                        setEditData({
                                                            ...editData!,
                                                            team_id: value === "none" ? null : Number(value),
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="No Team" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">No Team</SelectItem>
                                                        {teams.map((team) => (
                                                            <SelectItem key={team.id} value={String(team.id)}>
                                                                {team.team_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {mentee.team_name || "—"}
                                                </span>
                                            )}
                                        </td>

                                        {/* Batch */}
                                        <td className="px-6 py-4">
                                            <Badge className="bg-white/10 text-muted-foreground border-white/20">
                                                Batch {mentee.batch}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {editingId === mentee.id ? (
                                                    <>
                                                        {/* Scrum Master Toggle */}
                                                        <label
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer ${editData?.is_scrum_master
                                                                ? "bg-yellow-500/20 text-yellow-400"
                                                                : "bg-white/5 text-muted-foreground"
                                                                } ${editData?.role === "hustler" ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={editData?.is_scrum_master || false}
                                                                onChange={(e) =>
                                                                    setEditData({
                                                                        ...editData!,
                                                                        is_scrum_master: e.target.checked,
                                                                    })
                                                                }
                                                                disabled={editData?.role === "hustler"}
                                                                className="sr-only"
                                                            />
                                                            <Crown className="w-4 h-4" />
                                                        </label>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={saveEdit}
                                                            disabled={isSaving}
                                                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                        >
                                                            {isSaving ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Save className="w-4 h-4" />
                                                            )}
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={cancelEdit}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </motion.button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => startEdit(mentee)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDelete(mentee.id)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </motion.button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
}
