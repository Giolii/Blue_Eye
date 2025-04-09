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
    <div className="max-w-md  space-y-8 p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
      <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-zinc-50">
        Register
      </h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            autoComplete="off"
            maxLength={30}
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
          onClick={(e) => handleSubmit(e)}
        >
          Register
        </button>
        <div className="text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Already a User?{" "}
          </p>
          <Link
            to={"/login"}
            className="text-lg text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
