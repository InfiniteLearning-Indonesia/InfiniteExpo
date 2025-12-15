import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { getDashboardStats, type DashboardStats } from "../../api/project.api";
import { getActiveBatch, type Batch } from "../../api/batch.api";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
    FolderKanban,
    Users,
    GraduationCap,
    Rocket,
    TrendingUp,
    Layers,
    Star,
    Loader2,
    AlertCircle,
    Plus,
} from "lucide-react";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
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

export default function Dashboard() {
    const { user } = useAppSelector((state) => state.auth);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, batchRes] = await Promise.allSettled([
                    getDashboardStats(),
                    getActiveBatch(),
                ]);

                if (statsRes.status === "fulfilled") {
                    setStats(statsRes.value.data);
                }

                if (batchRes.status === "fulfilled") {
                    setActiveBatch(batchRes.value.data);
                }

                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <Loader2 className="w-12 h-12 text-[#8A3DFF] animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="bg-card border-white/5 max-w-md">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
                        <p className="text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const quickStats = [
        {
            label: "Total Projects",
            value: stats?.total_projects || 0,
            icon: FolderKanban,
            color: "text-blue-400",
            bgColor: "bg-blue-400/10",
        },
        {
            label: "Published",
            value: stats?.published_projects || 0,
            icon: Rocket,
            color: "text-green-400",
            bgColor: "bg-green-400/10",
        },
        {
            label: "Teams",
            value: stats?.total_teams || 0,
            icon: Users,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
        },
        {
            label: "Mentees",
            value: stats?.total_mentees || 0,
            icon: GraduationCap,
            color: "text-orange-400",
            bgColor: "bg-orange-400/10",
        },
        {
            label: "Best Products",
            value: stats?.best_products || 0,
            icon: Star,
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
        },
    ];

    const quickActions = [
        {
            label: "Add Project",
            href: "/admin/projects",
            icon: FolderKanban,
            description: "Create a new project",
        },
        {
            label: "Manage Batches",
            href: "/admin/batches",
            icon: Layers,
            description: "View and activate batches",
        },
        {
            label: "View Teams",
            href: "/admin/teams",
            icon: Users,
            description: "Manage team assignments",
        },
        {
            label: "View Mentees",
            href: "/admin/mentees",
            icon: GraduationCap,
            description: "Edit mentee information",
        },
    ];

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
        >
            {/* Header */}
            <motion.div variants={fadeInUp} className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                            Welcome back, {user?.name?.split(" ")[0] || "Admin"}! 👋
                        </h1>
                        <p className="text-muted-foreground">
                            Here's what's happening with your exhibition.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeBatch && (
                            <Badge className="bg-[#8A3DFF]/10 text-[#8A3DFF] border-[#8A3DFF]/30 px-4 py-2">
                                <Layers className="w-4 h-4 mr-2" />
                                {activeBatch.name || `Batch ${activeBatch.batch_number}`}
                            </Badge>
                        )}
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/30 px-4 py-2">
                            {user?.role === "admin" ? "Administrator" : "User"}
                        </Badge>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
            >
                {quickStats.map((stat) => (
                    <motion.div key={stat.label} variants={fadeInUp} whileHover={{ y: -4 }}>
                        <Card className="bg-card border-white/5 hover:border-[#8A3DFF]/30 transition-all h-full">
                            <CardContent className="p-4 lg:p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                </div>
                                <p className="text-2xl lg:text-3xl font-bold mb-1">{stat.value}</p>
                                <p className="text-muted-foreground text-xs lg:text-sm">{stat.label}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.label} to={action.href}>
                            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                                <Card className="bg-card border-white/5 hover:border-[#8A3DFF]/30 transition-all cursor-pointer group h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#8A3DFF]/10 flex items-center justify-center group-hover:bg-[#8A3DFF]/20 transition-colors">
                                                <action.icon className="w-6 h-6 text-[#8A3DFF]" />
                                            </div>
                                            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-[#8A3DFF] transition-colors" />
                                        </div>
                                        <h3 className="font-semibold mb-1">{action.label}</h3>
                                        <p className="text-sm text-muted-foreground">{action.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Active Batch Info */}
            {activeBatch && (
                <motion.div variants={fadeInUp}>
                    <Card className="bg-gradient-to-r from-[#8A3DFF]/10 to-purple-500/5 border-[#8A3DFF]/20">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Layers className="w-5 h-5 text-[#8A3DFF]" />
                                        <h3 className="font-semibold">Active Batch</h3>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {activeBatch.name || `Batch ${activeBatch.batch_number}`}
                                    </p>
                                    {activeBatch.start_date && activeBatch.end_date && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {new Date(activeBatch.start_date).toLocaleDateString()} -{" "}
                                            {new Date(activeBatch.end_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <Link to="/admin/batches">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-3 bg-[#8A3DFF]/20 border border-[#8A3DFF]/30 rounded-xl font-medium text-[#8A3DFF] hover:bg-[#8A3DFF]/30 transition-all"
                                    >
                                        Manage Batches
                                    </motion.button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
