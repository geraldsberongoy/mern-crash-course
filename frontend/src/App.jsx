import NavBar from "./components/NavBar/NavBar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";

const App = () => {
  return (
    <div data-theme="bumblebee" className="flex min-h-screen flex-col">
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </div>
  );
};

export default App;
