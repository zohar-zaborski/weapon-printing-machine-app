import React from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "../atoms/authAtoms";
import authService from "../services/auth.service";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../media/images/print_logo.png";

const AppNavbar: React.FC = () => {
  const [isAuthenticated] = useAtom(authAtom);

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Logo" style={{ height: "40px", marginRight: "10px" }} />
         
        </div>
        <div className="collapse navbar-collapse justify-content-end">
          {isAuthenticated && (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/customize">
                  Customize
                </Link>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link" to="/saved-weapons">
                  Saved Weapons
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/print-jobs">
                  Print Jobs
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm nav-link"
                  onClick={authService.logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
