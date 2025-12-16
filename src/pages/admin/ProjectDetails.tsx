import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProjectById, type Project, categoryLabels, type ProjectCategory } from "../../api/project.api";
import { programLabels, type MenteeProgram } from "../../api/mentee.api";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import {
    ArrowLeft,
    ExternalLink,
    Users,
    Lightbulb,
    Package,
    FileText,
    Layers,
    Monitor,
    Brain,
    Code2,
    Loader2,
    AlertCircle,
    Smartphone,
    Gamepad2,
    Crown,
    Edit,
    Linkedin,
    Video,
    Cpu,
    Shield,
} from "lucide-react";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export default function AdminProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProject = async () => {
            if (!id) return;

            try {
                const res = await getProjectById(id);
                if (isMounted) {
                    setProject(res.data);
                    setError(null);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError("Project not found or failed to load.");
                    setIsLoading(false);
                }
            }
        };

        fetchProject();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const getImageUrl = (path?: string) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return `http://localhost:3000${path}`;
    };

    const getCategoryInfo = (category?: string) => {
        const cat = category as ProjectCategory;
        const base = {
            label: categoryLabels[cat] || "Unknown Category",
            description: "No description available.",
        };

        // New categories only
        if (cat === "ai_dev") {
            return { ...base, icon: <Brain className="w-5 h-5" />, gradient: "from-purple-500 to-violet-500" };
        }
        if (cat === "web_dev") {
            return { ...base, icon: <Code2 className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500" };
        }
        if (cat === "mobile_dev") {
            return { ...base, icon: <Smartphone className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500" };
        }
        if (cat === "merge_web_ai") {
            return { ...base, icon: <Layers className="w-5 h-5" />, gradient: "from-indigo-500 to-purple-500" };
        }
        if (cat === "merge_web_mobile") {
            return { ...base, icon: <Layers className="w-5 h-5" />, gradient: "from-teal-500 to-blue-500" };
        }
        if (cat === "merge_collab") {
            return { ...base, icon: <Layers className="w-5 h-5" />, gradient: "from-pink-500 to-rose-500" };
        }
        if (cat === "game_dev") {
            return { ...base, icon: <Gamepad2 className="w-5 h-5" />, gradient: "from-red-500 to-orange-500" };
        }
        if (cat === "hcrh") {
            return { ...base, icon: <Monitor className="w-5 h-5" />, gradient: "from-amber-500 to-yellow-500" };
        }
        if (cat === "comp_net_sec") {
            return { ...base, icon: <Shield className="w-5 h-5" />, gradient: "from-slate-500 to-zinc-500" };
        }

        // Fallback
        return {
            label: categoryLabels[cat] || "Project",
            icon: <Code2 className="w-5 h-5" />,
            gradient: "from-blue-500 to-cyan-500"
        };
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-[#8A3DFF] animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading details...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/admin/projects")}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const categoryInfo = getCategoryInfo(project.category as string);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/projects")}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Project Details</h1>
                        <p className="text-muted-foreground">View detailed information about {project.title}</p>
                    </div>
                </div>

                <Link to={`/admin/projects/${project.id}/edit`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#8A3DFF] hover:bg-[#7a36e0] rounded-lg font-medium transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Project
                    </button>
                </Link>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
                    {/* Hero Img */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/50 border border-white/10">
                        {getImageUrl(project.thumbnail) ? (
                            <img src={getImageUrl(project.thumbnail)!} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Thumbnail
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6">
                            <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
                            <div className="flex items-center gap-3">
                                <Badge className={`bg-gradient-to-r ${categoryInfo.gradient} text-white border-0`}>
                                    {categoryInfo.icon}
                                    <span className="ml-1">{categoryInfo.label}</span>
                                </Badge>
                                {project.is_best_product && (
                                    <Badge className="bg-yellow-500/90 text-black border-0 gap-1">
                                        <Crown className="w-3 h-3" />
                                        Best Product
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <Card className="bg-card border-white/10">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#8A3DFF]" />
                                Description
                            </h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {project.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Big Idea */}
                    {project.big_idea && (
                        <Card className="bg-gradient-to-br from-[#8A3DFF]/10 to-transparent border-[#8A3DFF]/20">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-[#8A3DFF]" />
                                    Big Idea
                                </h3>
                                <p className="text-lg leading-relaxed">{project.big_idea}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* AI Technology */}
                    {project.ai_technology && (
                        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-purple-400" />
                                    AI/Algorithm Technology
                                </h3>
                                <p className="text-lg leading-relaxed">{project.ai_technology}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Demo Link - Embedded */}
                    {project.frontend_demo && (
                        <Card className="bg-card border-white/10 overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Monitor className="w-5 h-5 text-[#8A3DFF]" />
                                        <div>
                                            <h3 className="font-semibold">Live Demo</h3>
                                            <p className="text-sm text-muted-foreground truncate max-w-xs">{project.frontend_demo}</p>
                                        </div>
                                    </div>
                                    <a href={project.frontend_demo} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#8A3DFF] hover:bg-[#7a36e0] rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-white">
                                        <ExternalLink className="w-4 h-4" /> Open
                                    </a>
                                </div>
                                <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                                    <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="flex-1 mx-4">
                                            <div className="bg-black/50 rounded-md px-3 py-1 text-xs text-muted-foreground truncate">{project.frontend_demo}</div>
                                        </div>
                                    </div>
                                    <iframe
                                        src={project.frontend_demo}
                                        title={`${project.title} Demo`}
                                        className="w-full h-[300px] bg-white"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Showcase Video - Embedded */}
                    {project.showcase_video && (
                        <Card className="bg-card border-white/10 overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Video className="w-5 h-5 text-red-400" />
                                        <div>
                                            <h3 className="font-semibold">Showcase Video</h3>
                                            <p className="text-sm text-muted-foreground truncate max-w-xs">{project.showcase_video}</p>
                                        </div>
                                    </div>
                                    <a href={project.showcase_video} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                        <ExternalLink className="w-4 h-4" /> Open
                                    </a>
                                </div>
                                <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                                    <iframe
                                        src={project.showcase_video}
                                        title={`${project.title} Showcase Video`}
                                        className="w-full h-[300px]"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                        allowFullScreen
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

                {/* Right Column */}
                <motion.div variants={fadeInUp} className="space-y-6">
                    {/* Team Members */}
                    <Card className="bg-card border-white/10">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#8A3DFF]" />
                                Team Members
                            </h3>

                            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Team Name</p>
                                <p className="font-bold text-lg">{project.team_name || "Unnamed Team"}</p>
                            </div>

                            {project.members && project.members.length > 0 ? (
                                <div className="space-y-3">
                                    {project.members.map((member, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#8A3DFF]/30 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A3DFF] to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-sm truncate">{member.name}</p>
                                                    {/* Crown for Hustler/PM */}
                                                    {member.role === "hustler" && (
                                                        <div title="Hustler/PM">
                                                            <Crown className="w-4 h-4 text-yellow-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-xs text-muted-foreground truncate capitalize">{member.role?.replace(/_/g, ' ') || 'Member'}</p>
                                                    {member.program && (
                                                        <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-white/20 text-white/50">
                                                            {programLabels[member.program as MenteeProgram] || member.program}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {/* LinkedIn */}
                                                {member.linkedin_url && (
                                                    <a
                                                        href={member.linkedin_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1"
                                                    >
                                                        <Linkedin className="w-3 h-3" />
                                                        LinkedIn
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No members found.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card className="bg-card border-white/10">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#8A3DFF]" />
                                Project Metadata
                            </h3>
                            <Separator className="bg-white/5" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Batch</p>
                                <p className="font-medium">{project.batch ? `Batch ${project.batch}` : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                                <Badge className={project.is_published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                                    {project.is_published ? "Published" : "Draft"}
                                </Badge>
                            </div>
                            {project.repository && (
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Repository</p>
                                    <a href={project.repository} target="_blank" rel="noopener noreferrer" className="text-[#8A3DFF] hover:underline text-sm truncate block">
                                        {project.repository}
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
