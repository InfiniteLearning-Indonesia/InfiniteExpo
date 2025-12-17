import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    getPublishedProjects,
    type Project,
    categoryLabels,
    type ProjectCategory,
} from "../../api/project.api";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Search,
    Rocket,
    ArrowLeft,
    ExternalLink,
    Layers,
    Code2,
    Brain,
    Smartphone,
    Gamepad2,
    Trophy,
} from "lucide-react";

// Logo
const logoSrc = "/logo-nobg.png";

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
            delayChildren: 0.1,
        },
    },
};

type CategoryFilter = "all" | ProjectCategory;

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

    useEffect(() => {
        getPublishedProjects()
            .then((res) => {
                setProjects(res.data || []);
            })
            .catch(() => {
                setProjects([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Filter projects based on search and category
    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            categoryFilter === "all" || project.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (category?: string) => {
        if (!category) return <Code2 className="w-4 h-4" />;
        if (category.includes("ai")) return <Brain className="w-4 h-4" />;
        if (category.includes("mobile")) return <Smartphone className="w-4 h-4" />;
        if (category.includes("game")) return <Gamepad2 className="w-4 h-4" />;
        return <Code2 className="w-4 h-4" />;
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ==================== NAVBAR ==================== */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="fixed top-0 left-0 right-0 z-50 glass"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/">
                        <motion.div
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-[#8A3DFF]/50 p-px">
                                <img src={logoSrc} alt="InfiniteExpo Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Infinite<span className="text-gradient">Expo</span>
                            </span>
                        </motion.div>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* ==================== HEADER ==================== */}
            <section className="pt-32 pb-12 px-6 bg-gradient-hero">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-20 right-20 w-96 h-96 bg-[#8A3DFF]/10 rounded-full blur-[150px]"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto relative z-10"
                >
                    <motion.div variants={fadeInUp} className="mb-4">
                        <Badge className="bg-[#8A3DFF]/10 text-[#A366FF] border-[#8A3DFF]/30">
                            <Layers className="w-4 h-4 mr-2" />
                            Exhibition Gallery
                        </Badge>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        All <span className="text-gradient">Projects</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-muted-foreground max-w-2xl mb-10"
                    >
                        Explore all innovative capstone projects created by talented mentees
                        from Infinite Learning.
                    </motion.p>

                    {/* Search and Filter */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search projects or teams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#8A3DFF]/50 focus:ring-2 focus:ring-[#8A3DFF]/20 transition-all"
                            />
                        </div>

                        {/* Category Filter - Shadcn Select */}
                        <div className="w-full sm:w-[250px]">
                            <Select
                                value={categoryFilter}
                                onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
                            >
                                <SelectTrigger className="w-full h-[50px] bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.entries(categoryLabels).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ==================== PROJECTS GRID ==================== */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Results Count */}
                    <div className="mb-8 flex items-center justify-between">
                        <p className="text-muted-foreground">
                            Showing{" "}
                            <span className="text-white font-semibold">
                                {filteredProjects.length}
                            </span>{" "}
                            {filteredProjects.length === 1 ? "project" : "projects"}
                        </p>
                    </div>

                    <Separator className="mb-8 bg-white/5" />

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-80 bg-card rounded-2xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    variants={fadeInUp}
                                    whileHover={{ y: -8 }}
                                    className="group"
                                >
                                    <Link to={`/projects/${project.id}`}>
                                        <Card className="h-full overflow-hidden bg-card border-white/5 hover:border-[#8A3DFF]/30 transition-all duration-500 flex flex-col">
                                            <div className="relative h-48 overflow-hidden">
                                                {project.thumbnail ? (
                                                    <img
                                                        src={
                                                            project.thumbnail.startsWith("http")
                                                                ? project.thumbnail
                                                                : `https://api-exhibition.infinitelearningstudent.id${project.thumbnail}`
                                                        }
                                                        alt={project.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-[#8A3DFF]/20 to-[#8A3DFF]/5 flex items-center justify-center">
                                                        <Rocket className="w-12 h-12 text-[#8A3DFF]/50" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />





                                                {/* View Icon */}
                                                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ExternalLink className="w-5 h-5 text-white" />
                                                </div>
                                            </div>

                                            <CardContent className="p-6 flex flex-col flex-grow">
                                                <div className="mb-auto">
                                                    {/* Category Badge */}
                                                    <Badge
                                                        className={`w-40 ${(project.category as string)?.includes("merge")
                                                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                                            : "bg-gradient-to-r from-blue-500 to-cyan-500"
                                                            } text-white border-0 flex items-center gap-1`}
                                                    >
                                                        {getCategoryIcon(project.category as string)}
                                                        {categoryLabels[project.category as ProjectCategory] || "Web Development"}
                                                    </Badge>
                                                    {/* Best Project Badge */}
                                                    {Boolean(project.is_best_product) && (
                                                        <Badge
                                                            className="my-3 w-40 bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 flex items-center gap-1 shadow-lg"
                                                        >
                                                            <Trophy className="w-3 h-3" />
                                                            Best Product
                                                        </Badge>
                                                    )}
                                                    <h3 className="text-xl font-semibold my-2 group-hover:text-[#8A3DFF] transition-colors line-clamp-1">
                                                        {project.title}
                                                    </h3>

                                                    {project.team_name && (
                                                        <p className="text-sm text-[#8A3DFF] mb-2 font-medium">
                                                            {project.team_name}
                                                            {project.batch && (
                                                                <span className="text-muted-foreground">
                                                                    {" "}
                                                                    • Batch {project.batch}
                                                                </span>
                                                            )}
                                                        </p>
                                                    )}

                                                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-4">
                                                        {project.description ||
                                                            "An innovative project showcased at InfiniteExpo."}
                                                    </p>
                                                </div>

                                                {/* Team Members Preview */}
                                                {project.members && project.members.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-white/5">
                                                        <div className="flex -space-x-2 overflow-hidden">
                                                            {project.members.slice(0, 4).map((member, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="h-8 w-8 rounded-full ring-2 ring-background bg-zinc-800 flex items-center justify-center text-xs font-medium text-white cursor-help"
                                                                    title={`${member.name} - ${member.role}`}
                                                                >
                                                                    {member.name.charAt(0)}
                                                                </div>
                                                            ))}
                                                            {project.members.length > 4 && (
                                                                <div className="h-8 w-8 rounded-full ring-2 ring-background bg-zinc-700 flex items-center justify-center text-xs font-medium text-white">
                                                                    +{project.members.length - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 border border-dashed border-white/10 rounded-2xl"
                        >
                            <Search className="w-16 h-16 mx-auto mb-6 text-[#8A3DFF] opacity-50" />
                            <h3 className="text-2xl font-semibold mb-2">No Projects Found</h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery || categoryFilter !== "all"
                                    ? "Try adjusting your search or filter criteria."
                                    : "Projects are being prepared. Check back soon!"}
                            </p>
                            {(searchQuery || categoryFilter !== "all") && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCategoryFilter("all");
                                    }}
                                    className="px-6 py-3 bg-[#8A3DFF] rounded-full font-medium text-white"
                                >
                                    Clear Filters
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ==================== FOOTER ==================== */}
            <footer className="py-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} InfiniteExpo. Built with 💜 by Infinite
                        Learning.
                    </p>
                    <p className="text-muted-foreground text-sm">
                        <Link
                            to="/admin"
                            className="hover:text-white transition-colors"
                        >
                            Admin Panel
                        </Link>
                        <br />
                        <Link
                            to="/admin/login"
                            className="hover:text-white transition-colors"
                        >
                            Login Admin
                        </Link>
                    </p>

                </div>
            </footer>
        </div>
    );
}
