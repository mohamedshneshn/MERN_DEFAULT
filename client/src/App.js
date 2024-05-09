import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login/Login";
import Signup from "./components/auth/Signup/Signup";
import Navbar from "./components/shared/NavvBar/Navbar";
import UsersList from "./components/users/UsersList/UsersList";
import NewPlace from "./components/places/NewPlace/NewPlace";
import UserPlaces from "./components/users/UserPlaces/UserPlaces";
import EditPlace from "./components/places/EditPlace/EditPlace";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/:placeId" element={<EditPlace />} />
      </Routes>
    </Router>
  );
}

export default App;
