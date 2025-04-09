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
    <div className="max-w-md space-y-8 p-8 bg-amber-50 dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
      {errors && <ErrorMessage message={errors} />}
      <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-50">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email or Username
          </label>
          <input
            maxLength={"30"}
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-violet-500 dark:bg-violet-600 text-white rounded-md hover:bg-violet-600 dark:hover:bg-violet-700 cursor-pointer transition-colors duration-200"
        >
          Login
        </button>
        <div className="text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Not a User?{" "}
          </p>
          <Link
            to={"/register"}
            className="text-lg text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200"
          >
            Register
          </Link>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Or </p>
          <div
            className="text-lg text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200 cursor-pointer"
            onClick={guestLogin}
          >
            Login as a Guest
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
