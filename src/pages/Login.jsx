import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import ErrorMessage from "../components/reusable/ErrorMessage";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState(null);
  const { login, error, guestLogin } = useAuth();

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
      await login(formData.email, formData.password);
      Navigate;
    } catch (error) {
      setLocalError(error.response?.data?.error);
      console.error(error.response?.data?.error);
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

      {/* Accent element */}
      <div
        className="absolute top-1/4 left-1/3 h-80 w-80 rounded-full 
                     bg-gradient-to-r from-sky-300 to-indigo-400 opacity-30 
                     dark:from-sky-800 dark:to-indigo-900 dark:opacity-20 
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
            Login
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {errors && <ErrorMessage message={errors} />}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email or Username
            </label>
            <input
              maxLength="30"
              type="text"
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
              placeholder="Enter your email or username"
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
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 
                     bg-gradient-to-r from-sky-500 to-indigo-500 
                     dark:from-sky-600 dark:to-indigo-600 
                     text-white font-medium rounded-lg 
                     hover:from-sky-600 hover:to-indigo-600 
                     dark:hover:from-sky-500 dark:hover:to-indigo-500 
                     focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-indigo-500/50
                     shadow-md hover:shadow-lg hover:shadow-sky-500/20 dark:hover:shadow-indigo-600/20
                     transform hover:translate-y-[-1px] active:translate-y-[1px]
                     transition-all duration-200"
          >
            Sign In
          </button>

          <div className="pt-4 text-center border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Not a user yet?
            </p>
            <Link
              to="/register"
              className="inline-block text-sky-600 dark:text-sky-400 
                       hover:text-indigo-600 dark:hover:text-indigo-400 
                       font-medium text-lg transition-colors duration-200"
            >
              Register
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 mb-1">
              Or continue without an account
            </p>
            <button
              type="button"
              onClick={guestLogin}
              className="inline-block text-indigo-600 dark:text-indigo-400 
                       hover:text-sky-600 dark:hover:text-sky-400 
                       font-medium transition-colors duration-200"
            >
              Login as a Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
