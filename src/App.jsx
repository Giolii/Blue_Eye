import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Sidebar from "./components/navigation/Sidebar";

// import axios from "axios";
// axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="flex  h-screen justify-center ">
      <Sidebar />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
