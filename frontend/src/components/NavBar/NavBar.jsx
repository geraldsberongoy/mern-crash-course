import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import ThemeController from "../ThemeController/ThemeController";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 flex-none shadow-sm">
      <div className="flex-1">
        <Link to={"/"}>
          <p className="btn btn-ghost text-xl">PRODUCT STORE</p>
        </Link>
      </div>
      <div className="flex-none">
        <Link to="/create">
          <button className="btn btn-square btn-ghost">
            <FontAwesomeIcon size="2xl" icon={faSquarePlus} />
          </button>
        </Link>
        <button className="btn btn-square btn-ghost">
          <ThemeController />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
