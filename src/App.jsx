import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/navigation/Sidebar";
import UserProfile from "./pages/UserProfile";
import SinglePost from "./pages/SinglePost";
import FantasyGradientBackground from "./components/reusable/bg";

// import axios from "axios";
// axios.defaults.withCredentials = true;

function App() {
  return (
    <FantasyGradientBackground>
      <div className="flex  h-screen justify-center ">
        <div className="flex min-w-full sm:min-w-2xl   overflow-hidden shadow-2xl ">
          <Sidebar />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" index element={<Home />} />
              <Route path="/users/:userId" element={<UserProfile />} />
              <Route path="/posts/:postId" element={<SinglePost />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </div>
      </div>
    </FantasyGradientBackground>
  );
}

export default App;
