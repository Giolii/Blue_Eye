import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { currentUser, logout, guestLogin } = useAuth();

  return (
    <nav className=" flex flex-col text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 shadow-2xl h-screen w-20">
      {currentUser ? (
        <>
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:opacity-90 transition-colors"
          >
            Home
          </Link>
          <div>{currentUser.username}</div>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <>
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:opacity-90 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-xl font-bold tracking-tight hover:opacity-90 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-xl font-bold tracking-tight hover:opacity-90 transition-colors"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
