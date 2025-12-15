import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { getProjectById, type Project, categoryLabels, type ProjectCategory } from "../../api/project.api";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import {
    Sparkles,
    ArrowLeft,
    ExternalLink,
    Users,
    Lightbulb,
    Package,
    FileText,
    Layers,
    Image,
    Monitor,
    Brain,
    Code2,
    Loader2,
    AlertCircle,
    Smartphone,
    Gamepad2,
    Crown,
} from "lucide-react";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
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

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
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
            description: "An innovative capstone project.",
        };

        if (cat === "web_only") {
            return { ...base, icon: <Code2 className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500" };
        }
        if (cat === "mobile_only") {
            return { ...base, icon: <Smartphone className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500" };
        }
        if (cat === "ai_only") {
            return { ...base, icon: <Brain className="w-5 h-5" />, gradient: "from-purple-500 to-violet-500" };
        }
        if (cat === "game_only") {
            return { ...base, icon: <Gamepad2 className="w-5 h-5" />, gradient: "from-red-500 to-orange-500" };
        }
        // Merges
        if (cat?.includes("merge")) {
            return { ...base, icon: <Layers className="w-5 h-5" />, gradient: "from-pink-500 to-rose-500" };
        }

        // Fallback/Legacy
        return {
            label: categoryLabels[cat] || "Web Development",
            icon: <Code2 className="w-5 h-5" />,
            gradient: "from-blue-500 to-cyan-500",
            description: "This is a web-focused project"
        };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <Loader2 className="w-12 h-12 text-[#8A3DFF] animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading project details...</p>
                </motion.div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
                    <p className="text-muted-foreground mb-8">{error}</p>
                    <Link to="/projects">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-[#8A3DFF] rounded-full font-medium text-white flex items-center gap-2 mx-auto">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Projects
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const categoryInfo = getCategoryInfo(project.category as string);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ==================== NAVBAR ==================== */}
            <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/">
                        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center glow-accent">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Infinite<span className="text-gradient">Expo</span></span>
                        </motion.div>
                    </Link>
                    <Link to="/projects" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> All Projects
                    </Link>
                </div>
            </motion.nav>

            {/* ==================== HERO / THUMBNAIL SECTION ==================== */}
            <section className="pt-24 relative">
                <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                    {getImageUrl(project.thumbnail) ? (
                        <img src={getImageUrl(project.thumbnail)!} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#8A3DFF]/30 to-[#8A3DFF]/5 flex items-center justify-center">
                            <Image className="w-24 h-24 text-[#8A3DFF]/30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="absolute bottom-8 left-6 md:left-12">
                        <Badge className={`bg-gradient-to-r ${categoryInfo.gradient} text-white border-0 px-4 py-2 text-sm flex items-center gap-2`}>
                            {categoryInfo.icon}
                            {categoryInfo.label}
                        </Badge>
                    </motion.div>
                </div>
            </section>

            {/* ==================== PROJECT INFO ==================== */}
            <section className="py-12 px-6">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto">
                    <motion.div variants={fadeInUp} className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                        {project.team_name && (
                            <div className="flex items-center gap-2 text-[#8A3DFF]">
                                <Users className="w-5 h-5" />
                                <span className="font-semibold text-lg">{project.team_name}</span>
                                {project.batch && <span className="text-muted-foreground">• Batch {project.batch}</span>}
                            </div>
                        )}
                    </motion.div>

                    <Separator className="my-8 bg-white/10" />

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Details */}
                        <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-8">
                            {/* Big Idea */}
                            {project.big_idea && (
                                <Card className="bg-gradient-to-br from-[#8A3DFF]/10 to-transparent border-[#8A3DFF]/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#8A3DFF]/20 flex items-center justify-center">
                                                <Lightbulb className="w-6 h-6 text-[#8A3DFF]" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">Big Idea</h3>
                                                <p className="text-sm text-muted-foreground">The core concept behind this project</p>
                                            </div>
                                        </div>
                                        <p className="text-lg leading-relaxed">{project.big_idea}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Product Description */}
                            <Card className="bg-card border-white/5">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#8A3DFF]/10 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-[#8A3DFF]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">Product Description</h3>
                                            <p className="text-sm text-muted-foreground">What this product does</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {project.description || "This innovative project is showcased at InfiniteExpo."}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Frontend Demo */}
                            {project.frontend_demo && (
                                <Card className="bg-card border-white/5 overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-[#8A3DFF]/10 flex items-center justify-center">
                                                    <Monitor className="w-6 h-6 text-[#8A3DFF]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">Frontend Demo</h3>
                                                    <p className="text-sm text-muted-foreground">Live preview of the application</p>
                                                </div>
                                            </div>
                                            <motion.a href={project.frontend_demo} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 bg-[#8A3DFF] rounded-lg text-sm font-medium text-white flex items-center gap-2">
                                                <ExternalLink className="w-4 h-4" /> Open Demo
                                            </motion.a>
                                        </div>
                                        <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black">
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
                                            <iframe src={project.frontend_demo} title={`${project.title} Demo`} className="w-full h-[400px] bg-white" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>

                        {/* Right Column - Sidebar */}
                        <motion.div variants={fadeInUp} className="space-y-6">
                            {/* Team Members Card (New) */}
                            {project.members && project.members.length > 0 && (
                                <Card className="bg-card border-white/5">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Users className="w-5 h-5 text-[#8A3DFF]" />
                                            <h3 className="font-semibold">Team Members</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {project.members.map((member, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A3DFF] to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate capitalize">{member.role?.replace(/_/g, ' ') || 'Member'}</p>
                                                    </div>
                                                    {member.is_scrum_master && (
                                                        <div title="Scrum Master">
                                                            <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* App Icon */}
                            {project.app_icon && (
                                <Card className="bg-card border-white/5">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Image className="w-5 h-5 text-[#8A3DFF]" />
                                            <h3 className="font-semibold">App Icon</h3>
                                        </div>
                                        <div className="flex justify-center">
                                            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-[#8A3DFF]/30 shadow-lg shadow-[#8A3DFF]/20">
                                                <img src={getImageUrl(project.app_icon)!} alt={`${project.title} Icon`} className="w-full h-full object-cover" />
                                            </motion.div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Product Info Card */}
                            <Card className="bg-card border-white/5">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="w-5 h-5 text-[#8A3DFF]" />
                                        <h3 className="font-semibold">Product Info</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Product Name</p>
                                        <p className="font-medium">{project.title}</p>
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                                        <Badge className={`bg-gradient-to-r ${categoryInfo.gradient} text-white border-0`}>
                                            {categoryInfo.icon}
                                            <span className="ml-1">{categoryInfo.label}</span>
                                        </Badge>
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Group Name</p>
                                        <p className="font-medium">{project.team_name || "Not specified"}</p>
                                    </div>
                                    {project.batch && (
                                        <>
                                            <Separator className="bg-white/5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Batch</p>
                                                <p className="font-medium">Batch {project.batch}</p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Thumbnail Preview */}
                            <Card className="bg-card border-white/5">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Layers className="w-5 h-5 text-[#8A3DFF]" />
                                        <h3 className="font-semibold">Thumbnail</h3>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-white/10">
                                        {getImageUrl(project.thumbnail) ? (
                                            <img src={getImageUrl(project.thumbnail)!} alt={`${project.title} Thumbnail`} className="w-full h-auto object-cover" />
                                        ) : (
                                            <div className="w-full h-32 bg-[#8A3DFF]/10 flex items-center justify-center">
                                                <Image className="w-8 h-8 text-[#8A3DFF]/30" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Back Button */}
                    <motion.div variants={fadeIn} className="mt-16 flex justify-center">
                        <Link to="/projects">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-8 py-4 border border-white/20 rounded-full font-semibold text-white hover:bg-white/5 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5" /> Back to All Projects
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ==================== FOOTER ==================== */}
            <footer className="py-12 px-6 border-t border-white/5 mt-12">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} InfiniteExpo. Built with 💜 by Infinite Learning.</p>
                </div>
            </footer>
        </div>
    );
}
