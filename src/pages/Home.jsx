import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();

  return <h1 className="text-amber-50">HI, {currentUser?.username}</h1>;
};

export default Home;
