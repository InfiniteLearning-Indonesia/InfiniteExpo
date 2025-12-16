import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    getProjectsByActiveBatch,
    getAllProjects,
    deleteProject,
    publishProject,
    setBestProduct,
    categoryLabels,
    type ProjectCategory,
    type Project,
} from "../../api/project.api";
import { getAllBatches, getActiveBatch, type Batch } from "../../api/batch.api";
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
    FolderKanban,
    Plus,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    X,
    ExternalLink,
    Eye,
    EyeOff,
    Star,
    Trash2,
    Edit2,
    Users,
} from "lucide-react";

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchProjects = async () => {
        try {
            const projectsRes = selectedBatch
                ? await getAllProjects(selectedBatch)
                : await getProjectsByActiveBatch();
            setProjects(projectsRes.data || []);
        } catch (err) {
            console.error(err);
            // Try to get all without batch
            try {
                const res = await getAllProjects();
                setProjects(res.data || []);
            } catch {
                setError("Failed to load projects");
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
            } catch (err) {
                console.error(err);
                setError("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isLoading) {
            fetchProjects();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBatch]);

    const handlePublish = async (id: number, currentStatus: boolean) => {
        setActionLoading(id);
        try {
            await publishProject(id, !currentStatus);
            await fetchProjects();
        } catch (err) {
            console.error(err);
            setError("Failed to update publish status");
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
            setError("Failed to update best product status");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        setActionLoading(id);
        try {
            await deleteProject(id);
            await fetchProjects();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to delete project");
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#8A3DFF] animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage exhibition projects
                        {activeBatch && (
                            <span className="ml-2 text-[#8A3DFF]">
                                (Active: Batch {activeBatch.batch_number})
                            </span>
                        )}
                    </p>
                </div>
                <Link to="/admin/projects/new">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-accent rounded-xl font-medium text-white glow-accent"
                    >
                        <Plus className="w-5 h-5" />
                        Add Project
                    </motion.button>
                </Link>
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#8A3DFF]/50 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <Select
                        value={selectedBatch ? String(selectedBatch) : "active"}
                        onValueChange={(value) =>
                            setSelectedBatch(value === "active" ? null : Number(value))
                        }
                    >
                        <SelectTrigger className="min-w-[170px]">
                            <SelectValue placeholder="Active Batch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active Batch</SelectItem>
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
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span>Total: {filteredProjects.length} projects</span>
                <span className="text-white/20">|</span>
                <span className="text-green-400">
                    Published: {filteredProjects.filter((p) => p.is_published).length}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-yellow-400">
                    Best Products: {filteredProjects.filter((p) => p.is_best_product).length}
                </span>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <Card className="bg-card border-white/5">
                    <CardContent className="p-12 text-center">
                        <FolderKanban className="w-12 h-12 text-[#8A3DFF]/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery
                                ? "Try a different search term"
                                : "Add your first project to get started"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                        >
                            <Card
                                className={`bg-card border-white/5 hover:border-[#8A3DFF]/30 transition-all overflow-hidden h-full flex flex-col ${project.is_best_product
                                    ? "border-yellow-500/30 ring-1 ring-yellow-500/20"
                                    : ""
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-40 bg-white/5 overflow-hidden">
                                    {project.thumbnail ? (
                                        <img
                                            src={
                                                project.thumbnail.startsWith("http")
                                                    ? project.thumbnail
                                                    : `https://api-exhibition.infinitelearningstudent.id${project.thumbnail}`
                                            }
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FolderKanban className="w-12 h-12 text-white/10" />
                                        </div>
                                    )}

                                    {/* Status Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {project.is_best_product && (
                                            <Badge className="bg-yellow-500/90 text-black border-none">
                                                <Star className="w-3 h-3 mr-1" />
                                                Best
                                            </Badge>
                                        )}
                                        {!project.is_published && (
                                            <Badge className="bg-gray-500/90 text-white border-none">
                                                Draft
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="absolute top-3 right-3">
                                        <Badge
                                            className={`border-none text-white ${(project.category as string)?.includes('merge') ? 'bg-purple-500/90' :
                                                (project.category as string)?.includes('mobile') ? 'bg-green-500/90' :
                                                    (project.category as string)?.includes('ai') ? 'bg-purple-500/90' :
                                                        (project.category as string)?.includes('game') ? 'bg-red-500/90' :
                                                            'bg-blue-500/90'
                                                }`}
                                        >
                                            {categoryLabels[project.category as ProjectCategory] || "Web Development"}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-5 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <Link to={`/admin/projects/${project.id}`}>
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-[#8A3DFF] transition-colors">
                                                {project.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {project.description || "No description"}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            {project.team_name && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {project.team_name}
                                                </span>
                                            )}
                                            {project.batch && (
                                                <Badge className="bg-white/10 text-muted-foreground text-xs">
                                                    Batch {project.batch}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                        {/* Publish Toggle */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                handlePublish(project.id, project.is_published)
                                            }
                                            disabled={actionLoading === project.id}
                                            className={`p-2 rounded-lg transition-colors ${project.is_published
                                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                                : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                }`}
                                            title={project.is_published ? "Unpublish" : "Publish"}
                                        >
                                            {actionLoading === project.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : project.is_published ? (
                                                <Eye className="w-4 h-4" />
                                            ) : (
                                                <EyeOff className="w-4 h-4" />
                                            )}
                                        </motion.button>

                                        {/* Best Product Toggle */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                handleBestProduct(project.id, !!project.is_best_product)
                                            }
                                            disabled={actionLoading === project.id}
                                            className={`p-2 rounded-lg transition-colors ${project.is_best_product
                                                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                                : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                }`}
                                            title={
                                                project.is_best_product
                                                    ? "Remove Best Product"
                                                    : "Mark as Best Product"
                                            }
                                        >
                                            <Star
                                                className={`w-4 h-4 ${project.is_best_product ? "fill-current" : ""
                                                    }`}
                                            />
                                        </motion.button>

                                        {/* View Demo */}
                                        {project.frontend_demo && (
                                            <a
                                                href={project.frontend_demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}

                                        <div className="flex-1" />

                                        {/* Edit */}
                                        <Link to={`/admin/projects/${project.id}/edit`}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </motion.button>
                                        </Link>

                                        {/* Delete */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDelete(project.id)}
                                            disabled={actionLoading === project.id}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
