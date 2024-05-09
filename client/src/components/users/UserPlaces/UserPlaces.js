import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../shared/AuthContext/AuthContext";
import { useParams } from "react-router-dom";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import "./UserPlaces.css";

function UserPlaces() {
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { userId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePlaceId, setDeletePlaceId] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/places/user/${userId}`
        );
        const responseData = await response.json();
        if (!response.ok) {
          console.log(responseData.message);
        }
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [userId]);

  const deletePlace = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/places/${deletePlaceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        console.log(responseData.message);
      }
      setLoadedPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== deletePlaceId)
      );
      setIsDeleteModalOpen(false); // Close modal after successful deletion
    } catch (err) {
      console.log(err);
    }
  };

  const showDeleteModal = (placeId) => {
    setDeletePlaceId(placeId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  if (!loadedPlaces || loadedPlaces.length === 0) {
    return <h2>No places found. Maybe create one?</h2>;
  }

  return (
    <ul className="place-list">
      {loadedPlaces.map((place) => (
        <li key={place._id} className="place-item">
          {/* <img src={place.imageUrl} alt={place.title} className="place-image" /> */}
          <img
            src={`http://localhost:3001/${place.image}`}
            alt={place.title}
            className="place-image"
          />
          <div className="place-item__info">
            <h2>{place.title}</h2>
            <h3>{place.address}</h3>
            <p>{place.description}</p>
          </div>
          <div className="place-item__actions">
            <button className="view-btn">View on Map</button>
            <Link to={`/places/${place._id}`}>
              {auth.userId === place.creator && (
                <button className="edit-btn">Edit</button>
              )}
            </Link>
            {auth.userId === place.creator && (
              <button
                className="delete-btn"
                onClick={() => showDeleteModal(place._id)} // Handle delete operation directly here
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
      <Modal
        title="Delete Place"
        open={isDeleteModalOpen}
        onCancel={closeDeleteModal}
        footer={[
          <Button key="cancel" onClick={closeDeleteModal}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" onClick={deletePlace}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this place?</p>
      </Modal>
    </ul>
  );
}

export default UserPlaces;
