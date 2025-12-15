import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
    createProject,
    updateProject,
    getProjectById,
    categoryLabels,
    type ProjectCategory,
} from "../../api/project.api";
import { getAllBatches, getActiveBatch, type Batch } from "../../api/batch.api";
import { Card, CardContent } from "../../components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    ArrowLeft,
    Save,
    Loader2,
    AlertCircle,
    X,
    Upload,
    Image,
    Plus,
    Trash2,
    Crown,
    Users,
} from "lucide-react";

interface TeamMemberInput {
    id?: number;
    name: string;
    role: string;
    is_scrum_master: boolean;
}

// All available roles for team members
const allRoles = [
    { value: "hustler", label: "Hustler / PM" },
    { value: "hacker", label: "Hacker" },
    { value: "design_researcher", label: "Design Researcher" },
    { value: "data_engineer", label: "Data Engineer" },
    { value: "ml_engineer", label: "ML Engineer" },
    { value: "ml_ops", label: "ML Ops" },
];

export default function ProjectForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [batches, setBatches] = useState<Batch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        big_idea: "",
        category: "web_only" as ProjectCategory | string,
        frontend_demo: "",
        repository: "",
        batch: "",
        team_name: "", // Team name is now required input
        is_published: false,
        is_best_product: false,
        best_product_rank: "",
    });

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMemberInput[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const batchesRes = await getAllBatches();
            setBatches(batchesRes.data);

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
                    category: project.category || "non-merge",
                    frontend_demo: project.frontend_demo || "",
                    repository: project.repository || "",
                    batch: project.batch ? String(project.batch) : "",
                    team_name: project.team_name || "",
                    is_published: project.is_published || false,
                    is_best_product: project.is_best_product || false,
                    best_product_rank: project.best_product_rank
                        ? String(project.best_product_rank)
                        : "",
                });

                if (project.thumbnail) {
                    setThumbnailPreview(
                        project.thumbnail.startsWith("http")
                            ? project.thumbnail
                            : `http://localhost:3000${project.thumbnail}`
                    );
                }

                if (project.members) {
                    setTeamMembers(
                        project.members.map((m) => ({
                            id: m.id,
                            name: m.name,
                            role: m.role,
                            is_scrum_master: m.is_scrum_master,
                        }))
                    );
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load data");
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
            { name: "", role: "hacker", is_scrum_master: false },
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

        // Hustler cannot be scrum master
        if (field === "role" && value === "hustler") {
            updated[index].is_scrum_master = false;
        }

        setTeamMembers(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title) {
            setError("Product name is required");
            return;
        }
        if (!formData.team_name) {
            setError("Team name is required");
            return;
        }
        if (teamMembers.length === 0) {
            setError("At least one team member is required");
            return;
        }
        if (teamMembers.some(m => !m.name.trim())) {
            setError("All team members must have a name");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("big_idea", formData.big_idea);
            data.append("category", formData.category);
            data.append("frontend_demo", formData.frontend_demo);
            data.append("repository", formData.repository);
            data.append("batch", formData.batch);
            data.append("team_name", formData.team_name);
            data.append("is_published", String(formData.is_published));
            data.append("is_best_product", String(formData.is_best_product));
            if (formData.best_product_rank) {
                data.append("best_product_rank", formData.best_product_rank);
            }

            // Add team members as JSON
            data.append("team_members", JSON.stringify(teamMembers));

            if (thumbnailFile) {
                data.append("thumbnail", thumbnailFile);
            }

            if (isEditing && id) {
                await updateProject(Number(id), data);
            } else {
                await createProject(data);
            }

            navigate("/admin/projects");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to save project");
        } finally {
            setIsSaving(false);
        }
    };

    const roleOptions = allRoles;

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
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/admin/projects")}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        {isEditing ? "Edit Project" : "Add New Project"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing
                            ? "Update project details"
                            : "Create a new exhibition project"}
                    </p>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm flex-1">{error}</p>
                    <button onClick={() => setError(null)}>
                        <X className="w-4 h-4 text-red-400" />
                    </button>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card className="bg-card border-white/10">
                    <CardContent className="p-6 space-y-6">
                        <h2 className="text-lg font-semibold">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    placeholder="e.g., EcoTrack"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Big Idea</label>
                                <textarea
                                    value={formData.big_idea}
                                    onChange={(e) =>
                                        setFormData({ ...formData, big_idea: e.target.value })
                                    }
                                    placeholder="What problem does this product solve?"
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none resize-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Detailed product description..."
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category *</label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, category: value })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(categoryLabels).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Batch *</label>
                                <Select
                                    value={formData.batch}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, batch: value })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batches.map((b) => (
                                            <SelectItem key={b.id} value={String(b.batch_number)}>
                                                Batch {b.batch_number}
                                                {b.is_active ? " (Active)" : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Info - REQUIRED */}
                <Card className="bg-card border-white/10">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#8A3DFF]" />
                            <h2 className="text-lg font-semibold">Team Information *</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Team Name *</label>
                            <input
                                type="text"
                                value={formData.team_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, team_name: e.target.value })
                                }
                                placeholder="e.g., Green Innovators"
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-medium">Team Members *</label>
                                <button
                                    type="button"
                                    onClick={addTeamMember}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#8A3DFF]/10 text-[#8A3DFF] text-sm font-medium hover:bg-[#8A3DFF]/20 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Member
                                </button>
                            </div>

                            {teamMembers.length === 0 ? (
                                <div className="text-center py-8 border border-dashed border-white/20 rounded-xl">
                                    <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm">
                                        No team members yet. Click "Add Member" to add your team.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {teamMembers.map((member, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                                        >
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) =>
                                                    updateTeamMember(index, "name", e.target.value)
                                                }
                                                placeholder="Member name"
                                                className="flex-1 min-w-[150px] px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-[#8A3DFF]/50"
                                                required
                                            />
                                            <Select
                                                value={member.role}
                                                onValueChange={(value) =>
                                                    updateTeamMember(index, "role", value)
                                                }
                                            >
                                                <SelectTrigger className="w-[160px]">
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
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={member.is_scrum_master}
                                                    onChange={(e) =>
                                                        updateTeamMember(
                                                            index,
                                                            "is_scrum_master",
                                                            e.target.checked
                                                        )
                                                    }
                                                    disabled={member.role === "hustler"}
                                                    className="w-4 h-4 rounded accent-[#8A3DFF]"
                                                />
                                                <Crown className="w-4 h-4 text-yellow-400" />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => removeTeamMember(index)}
                                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Links */}
                <Card className="bg-card border-white/10">
                    <CardContent className="p-6 space-y-6">
                        <h2 className="text-lg font-semibold">Links</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Frontend Demo URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.frontend_demo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, frontend_demo: e.target.value })
                                    }
                                    placeholder="https://example.vercel.app"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Repository URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.repository}
                                    onChange={(e) =>
                                        setFormData({ ...formData, repository: e.target.value })
                                    }
                                    placeholder="https://github.com/user/repo"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Thumbnail */}
                <Card className="bg-card border-white/10">
                    <CardContent className="p-6 space-y-6">
                        <h2 className="text-lg font-semibold">Thumbnail</h2>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Preview */}
                            <div className="w-full sm:w-48 h-32 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Image className="w-10 h-10 text-white/20" />
                                )}
                            </div>

                            {/* Upload */}
                            <div className="flex-1">
                                <label className="block cursor-pointer">
                                    <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/20 hover:border-[#8A3DFF]/50 transition-colors">
                                        <Upload className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Upload thumbnail</p>
                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG up to 2MB
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Publishing Options */}
                <Card className="bg-card border-white/10">
                    <CardContent className="p-6 space-y-6">
                        <h2 className="text-lg font-semibold">Publishing Options</h2>

                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={(e) =>
                                        setFormData({ ...formData, is_published: e.target.checked })
                                    }
                                    className="w-5 h-5 rounded accent-[#8A3DFF]"
                                />
                                <span>Publish project</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_best_product}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            is_best_product: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 rounded accent-[#8A3DFF]"
                                />
                                <span>Best Product</span>
                            </label>

                            {formData.is_best_product && (
                                <div className="flex items-center gap-2">
                                    <label className="text-sm">Rank:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.best_product_rank}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                best_product_rank: e.target.value,
                                            })
                                        }
                                        placeholder="1"
                                        className="w-20 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <motion.button
                        type="submit"
                        disabled={isSaving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-accent rounded-xl font-medium text-white glow-accent disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isEditing ? "Update Project" : "Create Project"}
                    </motion.button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/projects")}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
