import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import ThemeController from "../ThemeController/ThemeController";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ toggleTheme, currentTheme }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 fixed z-50 flex-none shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <div className="navbar-start">
          {/* Logo */}
          <Link to="/" className="btn btn-ghost px-2 text-xl lg:px-4">
            <span className="text-primary font-bold">PRODUCT STORE</span>
          </Link>
        </div>

        {/* Navbar end - buttons */}
        <div className="navbar-end">
        <Link
            to="/create"
            className="btn btn-ghost btn-sm tooltip tooltip-bottom "
            data-tip="Create Product"
          >
            <FontAwesomeIcon icon={faSquarePlus} size="2xl" />
          </Link>
          <div className="tooltip tooltip-bottom" data-tip="Toggle Theme">
            <ThemeController
              toggleTheme={toggleTheme}
              currentTheme={currentTheme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
