import { useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";

const App = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div data-theme={theme} className="flex min-h-screen flex-col">
      <NavBar toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </div>
  );
};

export default App;
