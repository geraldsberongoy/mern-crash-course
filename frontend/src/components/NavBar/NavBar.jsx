import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import ThemeController from "../ThemeController/ThemeController";
import { Link } from "react-router-dom";

const NavBar = ({ toggleTheme }) => {
  return (
    <div className="navbar bg-base-100 fixed z-50 flex-none shadow-lg">
      <div className="flex-1">
        <Link to={"/"}>
          <p className="text-primary pl-5 text-2xl font-bold">PRODUCT STORE</p>
        </Link>
      </div>
      <div className="flex-none space-x-2 px-8">
        <Link to="/create">
          <div
            className="btn btn-square btn-ghost tooltip tooltip-bottom"
            data-tip="Create Product"
          >
            <FontAwesomeIcon size="2xl" icon={faSquarePlus} />
          </div>
        </Link>
        <div
          className="btn btn-square btn-ghost tooltip tooltip-bottom"
          data-tip="Toggle Theme"
        >
          <ThemeController toggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
