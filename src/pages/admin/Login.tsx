import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearError } from "../../store/slices/authSlice";
import { Card, CardContent } from "../../components/ui/card";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
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
      delayChildren: 0.2,
    },
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-[#8A3DFF]/10 rounded-full blur-[150px]"
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
          className="absolute bottom-20 right-20 w-80 h-80 bg-[#8A3DFF]/15 rounded-full blur-[120px]"
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

      {/* Login Card */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden border border-[#8A3DFF]/50 p-px">
                <img src={logoSrc} alt="InfiniteExpo Logo" className="w-full h-full object-contain" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold">
              Infinite<span className="text-gradient">Expo</span>
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">Admin Portal</p>
        </motion.div>

        {/* Card */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-[#8A3DFF]/10">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#8A3DFF]/10 border border-[#8A3DFF]/20 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-[#8A3DFF]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                <p className="text-muted-foreground text-sm">
                  Sign in to access the admin dashboard
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email)
                          setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="admin@infinitelearning.id"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border ${formErrors.email
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-[#8A3DFF]/50"
                        } text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20 transition-all`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-400">{formErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password)
                          setFormErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                      }}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border ${formErrors.password
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-[#8A3DFF]/50"
                        } text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#8A3DFF]/20 transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-400">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full py-4 bg-gradient-accent rounded-xl font-semibold text-white flex items-center justify-center gap-2 glow-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">
                    Secure Admin Access
                  </span>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-[#8A3DFF] transition-colors"
                >
                  ← Back to Exhibition
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={fadeInUp}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          © {new Date().getFullYear()} InfiniteExpo. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
