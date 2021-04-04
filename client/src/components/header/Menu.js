import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";

const Menu = () => {
  const navLinks = [
    { label: "Home", icon: "home", path: "/" },
    { label: "Message", icon: "near_me", path: "/message" },
    { label: "Discover", icon: "explore", path: "/discover" },
    { label: "Notify", icon: "favorite", path: "/notify" },
  ];

  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };
  return (
    <div className="menu">
      <ul className="navbar-nav flex-row">
        {navLinks.map((link, index) => (
          <li className={`nav-item px-1 ${isActive(link.path)}`} key={index}>
            <Link className="nav-link" to={link.path}>
              <span className="material-icons">{link.icon}</span>
            </Link>
          </li>
        ))}

        <li className="nav-item dropdown">
          <span
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Avatar src={auth.user.avatar} size="medium-avatar" />
          </span>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
              Profile
            </Link>
            <label
              htmlFor="theme"
              className="dropdown-item"
              onClick={() =>
                dispatch({ type: GLOBAL_TYPES.THEME, payload: !theme })
              }
            >
              {theme ? "Light Mode" : "Dark Mode"}
            </label>

            <div className="dropdown-divider"></div>
            <Link
              className="dropdown-item"
              to="/"
              onClick={() => dispatch(logout())}
            >
              Logout
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
