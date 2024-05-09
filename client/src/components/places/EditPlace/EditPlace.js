import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { AuthContext } from "../../shared/AuthContext/AuthContext";
import "./EditPlace.css";

function EditPlace() {
  const [loadedPlace, setLoadedPlace] = useState(); //used to store the loaded place to fill the form
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const placeId = useParams().placeId;

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/places/${placeId}`
        );

        const responseData = await response.json();

        if (!response.ok) {
          console.log(responseData.message);
        }

        setLoadedPlace(responseData.place);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlace();
  }, [placeId]);

  if (!loadedPlace) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/places/${placeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            address: values.address,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        navigate(-1);
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const loadedPlace = places.find((place) => place.id === placeId);

  return (
    <Form
      className="edit-place-form"
      name="basic"
      initialValues={{ remember: true }}
      autoComplete="off"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input your title!" }]}
        initialValue={loadedPlace.title}
        style={{ marginBottom: "40px" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input your description!" }]}
        initialValue={loadedPlace.description}
        style={{ marginBottom: "40px" }}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input your address!" }]}
        initialValue={loadedPlace.address}
        style={{ marginBottom: "40px" }}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ background: "red" }}>
          EDIT PLACE
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: "300px" }}
          onClick={() => navigate(-1)}
        >
          CANCEL
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EditPlace;
