import React, { useContext } from "react";
import { Route, Link, Routes } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import SignOut from "./signOut";
import esms_logo from "../assets/esms_logo.png";
import "./navBar.css";
import HomeIcon from "@mui/icons-material/Home";
function Nav({ pagename }) {
  const { currentUser, role } = useContext(AuthContext);

  return (
    <div className="header">
      <Link to="/">
        <img
          src={esms_logo}
          style={{
            width: "150px",
            height: "145px",
            display: "inline-block",
            marginLeft: "-10px",
            marginTop: "10px",
            marginBottom: "2px",
          }}
          alt="logo"
          className="logo"
        />
      </Link>
      <div className="nav-content">
        <h1>{pagename}</h1>
        <div
          className="sub-info"
          style={{ marginTop: "px", display: "inline-flex" }}
        >
          <h2>Hi</h2>
        </div>
        <div
          className="sub-info"
          style={{ marginLeft: "2px", display: "inline-flex" }}
        >
          <h2> {currentUser.displayName}!</h2>
        </div>
      </div>

      <nav>
        <ul>
          <li style={{ display: "flex", alignItems: "center" }}>
            <ul>
              {role === "Admin" && (
                <li>
                  <Link
                    to="/adminTools"
                    style={{
                      marginRight: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Admin Tools
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/"
                  title="Home"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <HomeIcon />
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <SignOut />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
