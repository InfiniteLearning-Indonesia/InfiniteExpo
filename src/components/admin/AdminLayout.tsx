import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/slices/authSlice";
import { Separator } from "../../components/ui/separator";
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    GraduationCap,
    Layers,
    LogOut,
    ChevronRight,
    Menu,
    X,
} from "lucide-react";

// Logo
const logoSrc = "/logo-nobg.png";

// Navigation items
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
    { icon: Layers, label: "Batches", href: "/admin/batches" },
    { icon: Users, label: "Teams", href: "/admin/teams" },
    { icon: GraduationCap, label: "Mentees", href: "/admin/mentees" },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/admin/login");
    };

    const isActive = (href: string) => {
        if (href === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`
          w-64 bg-card border-r border-white/5 flex flex-col fixed h-full z-40
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                {/* Logo */}
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-[#8A3DFF]/50 p-px">
                            <img src={logoSrc} alt="InfiniteExpo Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold">
                            Infinite<span className="text-gradient">Expo</span>
                        </span>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-2">Admin Panel</p>
                </div>

                <Separator className="bg-white/5" />

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive(item.href)
                                    ? "bg-[#8A3DFF]/10 text-[#8A3DFF] border border-[#8A3DFF]/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                }
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                            {isActive(item.href) && (
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/5">
                    {user && (
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#8A3DFF]/20 flex items-center justify-center">
                                <span className="text-[#8A3DFF] font-semibold">
                                    {user.name?.charAt(0).toUpperCase() || "A"}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{user.name || "Admin"}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 min-h-screen">
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
