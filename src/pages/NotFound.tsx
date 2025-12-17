import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";

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
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const floatAnimation = {
    y: [0, -20, 0],
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
    },
};

export const NotFound = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8A3DFF]/10 rounded-full blur-[150px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#8A3DFF]/15 rounded-full blur-[120px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Navbar */}
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
                                <img
                                    src={logoSrc}
                                    alt="InfiniteExpo Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Infinite<span className="text-gradient">Expo</span>
                            </span>
                        </motion.div>
                    </Link>

                    <Link
                        to="/"
                        className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </motion.nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 pt-20">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="text-center max-w-2xl mx-auto relative z-10"
                >
                    {/* Floating 404 Icon */}
                    <motion.div
                        animate={floatAnimation}
                        className="mb-8 inline-block"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 mx-auto rounded-3xl bg-[#8A3DFF]/10 border border-[#8A3DFF]/20 flex items-center justify-center">
                                <Compass className="w-16 h-16 text-[#8A3DFF]" />
                            </div>
                            {/* Decorative circles */}
                            <motion.div
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#8A3DFF]/30"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#8A3DFF]/40"
                                animate={{ scale: [1.2, 1, 1.2] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* 404 Text */}
                    <motion.div variants={fadeInUp} className="mb-4">
                        <span className="text-8xl md:text-9xl font-black text-gradient glow-text">
                            404
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Oops! Page Not Found
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed"
                    >
                        The page you're looking for seems to have wandered off into the
                        digital void. Let's get you back on track!
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/">
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 0 40px rgba(138, 61, 255, 0.4)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="group px-8 py-4 bg-gradient-accent rounded-full font-semibold text-white flex items-center gap-2 glow-accent transition-all"
                            >
                                <Home className="w-5 h-5" />
                                Go to Homepage
                            </motion.button>
                        </Link>

                        <Link to="/projects">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 border border-white/20 rounded-full font-semibold text-white hover:bg-white/5 transition-all flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                Explore Projects
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Fun Message */}
                    <motion.p
                        variants={fadeInUp}
                        className="mt-12 text-sm text-muted-foreground"
                    >
                        Error Code: 404 | Lost in the{" "}
                        <span className="text-[#8A3DFF]">Infinite</span> space
                    </motion.p>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} InfiniteExpo. Built with 💜 by
                        Infinite Learning Indonesia.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default NotFound;
