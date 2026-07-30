import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/Context";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      authLogin(res.user || res);
      navigate("/");
    } catch (err) {
      console.log("signUp error", err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 space-y-6 transition-all">
        {/* Header logo / Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-xl shadow-lg shadow-indigo-200">
            JB
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-slate-400">
            Join JobBridge to unlock opportunities
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-slate-50/50"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-slate-50/50"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="•••••••• (Min 6 chars)"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-slate-50/50"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="role"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
            >
              Join As
            </label>
            <select
              id="role"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 bg-slate-50/50 cursor-pointer"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            >
              <option value="">Choose role...</option>
              <option value="candidate">Candidate (Looking for jobs)</option>
              <option value="recruiter">Recruiter (Hiring talent)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3.5 px-4 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
