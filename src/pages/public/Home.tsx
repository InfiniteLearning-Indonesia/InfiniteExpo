import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { getBestProducts, type Project } from "../../api/project.api";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Rocket,
  Users,
  Trophy,
  ArrowDown,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Code2,
  ChevronRight,
  Monitor,
  Smartphone,
  Brain,
  Gamepad2,
  Sparkles,
} from "lucide-react";

// Logo
const logoSrc = "/logo-nobg.png";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// Stats Data
const stats = [
  { icon: Users, value: "500+", label: "Mentees" },
  { icon: Rocket, value: "150+", label: "Projects" },
  { icon: Trophy, value: "20+", label: "Awards" },
  { icon: GraduationCap, value: "9", label: "Batches" },
];

// Features Data
const features = [
  {
    icon: Lightbulb,
    title: "Innovative Solutions",
    description:
      "Projects that solve real-world problems with cutting-edge technology",
  },
  {
    icon: Code2,
    title: "Modern Tech Stack",
    description:
      "Built with the latest frameworks, tools, and best practices",
  },
  {
    icon: Users,
    title: "Collaborative Work",
    description:
      "Team projects showcasing effective collaboration and communication",
  },
];

// Programs Data
const programs = [
  {
    name: "Web Development",
    icon: <Monitor className="w-10 h-10" />,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "hover:border-blue-500/50",
  },
  {
    name: "Mobile Development",
    icon: <Smartphone className="w-10 h-10" />,
    color: "from-green-500/20 to-emerald-500/20",
    border: "hover:border-green-500/50",
  },
  {
    name: "AI Development",
    icon: <Brain className="w-10 h-10" />,
    color: "from-purple-500/20 to-violet-500/20",
    border: "hover:border-purple-500/50",
  },
  {
    name: "Game Development",
    icon: <Gamepad2 className="w-10 h-10" />,
    color: "from-red-500/20 to-orange-500/20",
    border: "hover:border-red-500/50",
  },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  useEffect(() => {
    // Fetch Best Products (automatically active batch from backend)
    getBestProducts({ limit: 6 })
      .then((res) => {
        setProjects(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setProjects([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const scrollToContent = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ==================== NAVBAR ==================== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
            {["About", "Projects", "Programs", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8A3DFF] transition-all group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="w-10" />
        </div>
      </motion.nav>

      {/* ==================== HERO SECTION ==================== */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-hero"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-[#8A3DFF]/20 rounded-full blur-[120px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#8A3DFF]/15 rounded-full blur-[150px]"
            animate={{
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Hero Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium border-[#8A3DFF]/30 bg-[#8A3DFF]/10 text-[#A366FF] backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Infinite Learning Capstone Project Exhibition
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1]"
          >
            Where Ideas{" "}
            <span className="text-gradient glow-text">Come to Life</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover innovative capstone projects created by talented mentees
            from Infinite Learning. Each project represents months of learning,
            creativity, and dedication.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={scrollToContent}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(138, 61, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-gradient-accent rounded-full font-semibold text-white flex items-center gap-2 glow-accent transition-all"
            >
              Explore Projects
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.a
              href="#programs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-white/20 rounded-full font-semibold text-white hover:bg-white/5 transition-all flex items-center gap-2"
            >
              View Programs
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
            onClick={scrollToContent}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="relative py-20 px-6 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8A3DFF]/5 to-transparent" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleUp}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#8A3DFF]/10 border border-[#8A3DFF]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#8A3DFF]/20 transition-all duration-300">
                <stat.icon className="w-7 h-7 text-[#8A3DFF]" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section id="about" className="py-24 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 bg-[#8A3DFF]/10 text-[#A366FF] border-[#8A3DFF]/30">
              About The Exhibition
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Showcasing <span className="text-gradient">Excellence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              InfiniteExpo is a digital exhibition platform that celebrates the
              innovative capstone projects created by mentees of Infinite
              Learning. Here, creativity meets technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full bg-card hover:bg-card-hover border-white/5 hover:border-[#8A3DFF]/30 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#8A3DFF]/10 border border-[#8A3DFF]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#8A3DFF]/20 transition-all duration-300">
                      <feature.icon className="w-7 h-7 text-[#8A3DFF]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== HIGHLIGHTS SECTION ==================== */}
      <section id="projects" className="py-24 px-6 bg-[#050505]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <Badge className="mb-4 bg-[#8A3DFF]/10 text-[#A366FF] border-[#8A3DFF]/30">
                Active Batch Highlights
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Exhibition <span className="text-gradient">Best Products</span>
              </h2>
            </div>
            <Link
              to="/projects"
              className="flex items-center gap-2 text-[#8A3DFF] font-medium hover:underline"
            >
              View All Projects
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>

          <Separator className="mb-12 bg-white/5" />

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-card rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link to={`/projects/${project.id}`}>
                    <Card className="h-full overflow-hidden bg-card border-white/5 hover:border-[#8A3DFF]/30 transition-all duration-500 flex flex-col">
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={
                            project.thumbnail?.startsWith("http")
                              ? project.thumbnail
                              : `https://api-exhibition.infinitelearningstudent.id${project.thumbnail}`
                          }
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Best Product Badge */}
                        {project.is_best_product && (
                          <Badge className="absolute top-4 right-4 bg-yellow-500/90 text-black border-0 flex gap-1 items-center">
                            <Trophy className="w-3 h-3" />
                            Best Product
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="mb-auto">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-[#8A3DFF] transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          {project.team_name && (
                            <p className="text-sm text-[#8A3DFF] mb-2 font-medium">
                              {project.team_name}
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
                            <p className="text-xs text-muted-foreground mb-2">Developed by:</p>
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
              variants={fadeIn}
              className="text-center py-20 border border-dashed border-white/10 rounded-2xl"
            >
              <Trophy className="w-16 h-16 mx-auto mb-6 text-[#8A3DFF] opacity-50" />
              <h3 className="text-2xl font-semibold mb-2">
                Coming Soon
              </h3>
              <p className="text-muted-foreground">
                Best Products for the active batch will be announced soon!
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ==================== PROGRAMS SECTION ==================== */}
      <section id="programs" className="py-24 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="mb-4 bg-[#8A3DFF]/10 text-[#A366FF] border-[#8A3DFF]/30">
              Our Programs
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore Our <span className="text-gradient">Programs</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Infinite Learning offers diverse learning tracks, each producing
              unique and impactful capstone projects.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card
                  className={`h-full bg-gradient-to-br ${program.color} border-white/5 ${program.border} transition-all duration-300`}
                >
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full min-h-[200px]">
                    <div className="mb-6 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      {program.icon}
                    </div>
                    <h3 className="text-lg font-bold">{program.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative p-12 md:p-16 rounded-3xl border-gradient overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8A3DFF]/10 via-transparent to-[#8A3DFF]/5" />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <img src={logoSrc} alt="InfiniteExpo Logo" className="w-20 h-16 object-contain" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-gradient">Explore?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Dive into the world of innovation and creativity. Discover
                projects that push boundaries and inspire change.
              </p>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 60px rgba(138, 61, 255, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-10 py-4 bg-gradient-accent rounded-full font-semibold text-white glow-accent"
              >
                Start Exploring
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer id="contact" className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border border-[#8A3DFF]/50 p-px">
                <img src={logoSrc} alt="InfiniteExpo Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold">
                Infinite<span className="text-gradient">Expo</span>
              </span>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a
                href="https://infinitelearning.id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Infinite Learning
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                About
              </a>
              <a
                href="#projects"
                className="hover:text-white transition-colors"
              >
                Projects
              </a>
            </div>
          </div>

          <Separator className="my-8 bg-white/5" />

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} InfiniteExpo. Built with 💜 by
              Infinite Learning Indonesia.
            </p>
            <p>Showcasing the future of technology.</p>
            <Link
              to="/admin"
              className="hover:text-white transition-colors"
            >
              Admin Panel
            </Link>
            <Link
              to="/admin/login"
              className="hover:text-white transition-colors"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
