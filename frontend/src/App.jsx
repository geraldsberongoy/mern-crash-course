import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import ToastContainer from "./components/Toast/ToastContainer";
import { useNotification } from "./context/NotificationContext";

// Configure axios defaults
const setupAxios = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  axios.defaults.baseURL = apiUrl;

  // Add request interceptor for handling errors globally
  axios.interceptors.request.use(
    (config) => {
      // You can add auth headers here if needed later
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Add response interceptor for handling errors globally
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error;
      // Handle different error statuses differently if needed
      if (response && response.status === 401) {
        console.error("Unauthorized access");
        // Handle auth errors
      }
      return Promise.reject(error);
    },
  );
};

const App = () => {
  const [theme, setTheme] = useState(() => {
    // Retrieve theme from localStorage on initial load
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Get notifications from context
  const { notifications, removeNotification } = useNotification();

  // Setup axios when app initializes
  useEffect(() => {
    setupAxios();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dracula" : "light"));
  };

  return (
    <div data-theme={theme} className="flex min-h-screen flex-col">
      <NavBar toggleTheme={toggleTheme} currentTheme={theme} />
      <div className="container mx-auto flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />

      {/* Toast notification container */}
      <ToastContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  );
};

// Simple 404 page
const NotFound = () => (
  <div className="flex h-[70vh] flex-col items-center justify-center">
    <h1 className="text-4xl font-bold">404</h1>
    <p className="mt-2 text-lg">Page not found</p>
    <a href="/" className="btn btn-primary mt-4">
      Go Home
    </a>
  </div>
);

// Simple Footer component
const Footer = () => (
  <footer className="footer footer-center bg-base-300 text-base-content p-4">
    <div>
      <p>© {new Date().getFullYear()} - MERN Products App</p>
    </div>
  </footer>
);

export default App;
