import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ErrorMessage from "../components/reusable/ErrorMessage";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [localError, setLocalError] = useState(null);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLocalError("");
      await register(formData.username, formData.email, formData.password);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setLocalError(error);
    }
  };

  const errors = localError || error;

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-4 py-12">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 via-slate-200 to-blue-100 
                     dark:from-slate-800 dark:via-slate-900 dark:to-blue-950"
      ></div>

      {/* Accent elements */}
      <div
        className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full 
                     bg-gradient-to-r from-indigo-300 to-sky-400 opacity-30 
                     dark:from-indigo-800 dark:to-sky-900 dark:opacity-20 
                     blur-xl -z-10"
      ></div>

      <div
        className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full 
                     bg-gradient-to-r from-sky-300 to-indigo-400 opacity-20 
                     dark:from-sky-800 dark:to-indigo-900 dark:opacity-15 
                     blur-xl -z-10"
      ></div>

      <div
        className="max-w-md w-full space-y-8 p-8 
                    bg-white/80 dark:bg-slate-800/80 
                    backdrop-blur-sm rounded-xl 
                    shadow-xl border border-slate-200/50 dark:border-slate-700/50 
                    transition-all duration-300"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Create Account
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Join our community today!
          </p>
        </div>

        {errors && <ErrorMessage message={errors} />}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              autoComplete="off"
              maxLength={30}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 
                       border border-slate-300 dark:border-slate-600 
                       rounded-lg bg-white/60 dark:bg-slate-700/60 
                       text-slate-800 dark:text-slate-200 
                       placeholder-slate-400 dark:placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-sky-400/50 
                       focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <input
              autoComplete="off"
              maxLength={15}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 
                       border border-slate-300 dark:border-slate-600 
                       rounded-lg bg-white/60 dark:bg-slate-700/60 
                       text-slate-800 dark:text-slate-200 
                       placeholder-slate-400 dark:placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-sky-400/50 
                       focus:border-transparent transition-all duration-200"
              placeholder="Choose a username"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 
                       border border-slate-300 dark:border-slate-600 
                       rounded-lg bg-white/60 dark:bg-slate-700/60 
                       text-slate-800 dark:text-slate-200 
                       placeholder-slate-400 dark:placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-sky-400/50 
                       focus:border-transparent transition-all duration-200"
              placeholder="Create a secure password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 
                     bg-gradient-to-r from-indigo-500 to-sky-500 
                     dark:from-indigo-600 dark:to-sky-600 
                     text-white font-medium rounded-lg 
                     hover:from-indigo-600 hover:to-sky-600 
                     dark:hover:from-indigo-500 dark:hover:to-sky-500 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-sky-500/50
                     shadow-md hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-sky-600/20
                     transform hover:translate-y-[-1px] active:translate-y-[1px]
                     transition-all duration-200"
          >
            Create Account
          </button>

          <div className="pt-4 text-center border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="inline-block text-indigo-600 dark:text-indigo-400 
                       hover:text-sky-600 dark:hover:text-sky-400 
                       font-medium text-lg transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
