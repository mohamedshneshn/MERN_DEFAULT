import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";

import "./Navbar.css";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";

function Navbar() {
  const auth = useContext(AuthContext); //use the useContext hook to access the context object
  const userId = auth.userId;

  const navigate = useNavigate(); //use the useNavigate hook to access the navigate function

  const items = [
    {
      key: "1",
      label: <Link to="/">All Users</Link>,
    },
    {
      key: "2",
      label: <Link to="/{userId}/places">My Places</Link>,
    },
    {
      key: "3",
      label: <Link to="/places/new">Add Place</Link>,
    },
    {
      key: "4",
      label: <Link to="/auth">Authenticate</Link>,
    },
  ];

  function handleLogout() {
    auth.logout();
    navigate("/");
  }

  return (
    <nav>
      <h1>Places</h1>
      <ul className="nav-links">
        <li>
          <Link to="/">All Users</Link>
        </li>
        {auth.isLoggedIn && (
          <li>
            <Link to={`/${userId}/places`}>My Places</Link>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <Link to="/places/new">Add Place</Link>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <Link to="/login">Login/Signup</Link>
          </li>
        )}

        {auth.isLoggedIn && (
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        )}
      </ul>

      <Dropdown
        className="dropdown"
        menu={{ items }}
        placement="bottomRight" //or "bottomRight" or "topLeft" or "topCenter" or "topRight"
        trigger={["hover"]}
      >
        <Button icon={<MenuOutlined />} />
      </Dropdown>
    </nav>
  );
}

export default Navbar;
