import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  ArrowRight,
  Key,
  AlertCircle,
} from "lucide-react";
import { adminService } from "../../_services/admin.service";
import { useAdminStore } from "@/stores/admin.store";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setAdmin, handleLoading, loading } = useAdminStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleLoading(true);
    try {
      const data = await adminService.login({ email, password });
      setAdmin(data.admin, data.admin_access_token);
      navigate("/admin"); // Navigate to admin dashboard
    } catch (error) {
      console.error(error);
      // Here you might want to set an error state to display a message to the user
    } finally {
      handleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="bg-white/90 max-w-[500px] w-full dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-500/10 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        {/* Card Header */}
        <div className="p-8 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isForgotPassword ? "Reset Password" : "Administrator Login"}
              </h2>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {isForgotPassword
              ? "Enter your email to receive a password reset link"
              : "Access your property management dashboard"}
          </p>
        </div>

        {/* Card Content */}
        <div className="p-8 pt-6">
          {isForgotPassword ? (
            /* Forgot Password Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    We'll send a secure password reset link to your registered
                    email address.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      <span>Registered Email</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="admin@amaarproperty.com"
                      className="w-full px-4 py-3 pl-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-900 dark:text-white"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      <span>Admin Email</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="admin@amaarproperty.com"
                      disabled={loading}
                      className="w-full px-4 py-3 pl-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-900 dark:text-white"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Password</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        disabled={loading}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full px-4 py-3 pl-11 pr-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-slate-900 dark:text-white"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    Remember this device for 30 days
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group px-4 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Spinner className="mr-2" />
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>
          )}

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>
                  System Status:{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Online
                  </span>
                </span>
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>256-bit SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
