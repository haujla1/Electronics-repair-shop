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
            width: "140px",
            height: "140px",
            display: "inline-block",
            marginLeft: "-18px",
          }}
          alt="logo"
          className="logo"
        />
      </Link>
      <div className="nav-content">
        <h1>{pagename}</h1>
        <div
          className="sub-info"
          style={{ marginTop: "10px", display: "inline-flex" }}
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
          <li>
            {role == "Admin" ? (
              <Link to="/adminTools" style={{ display: "inline-block" }}>
                Admin Tools
              </Link>
            ) : (
              <></>
            )}
          </li>
          <Link to="/" title="Home">
            <HomeIcon />
          </Link>
          <li>
            <SignOut />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
