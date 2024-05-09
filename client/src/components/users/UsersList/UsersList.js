import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../shared/Spinner/Spinner";
import "./UsersList.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users");
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setUsers(responseData.users);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []); //dependency array is empty, so this effect runs only once when the component renders

  return (
    <>
      {isLoading && <Spinner />}
      <ul className="users-list">
        {users &&
          users.map((user) => (
            <li key={user.id} className="user-item-li">
              <Link to={`/${user.id}/places`}>
                {" "}
                {/* Link to the user's profile */}
                <div className="user-item">
                  <div className="user-item_image">
                    <img
                      src={`http://localhost:3001/${user.image}`} //display the user's image
                      alt={user.name}
                      className="user-image"
                    />
                  </div>
                  <div className=" the length of user name">
                    <h2>{user.name}</h2>
                    <h3>
                      {" "}
                      {user.places.length}{" "}
                      {user.places.length === 1 ? "Place" : "Places"}
                    </h3>
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
}

export default UsersList;
