import React, { useContext, useState } from "react";
import { Button, Form, Input, Upload, message } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { AuthContext } from "../../shared/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import "./NewPlace.css";

function NewPlace() {
  const auth = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("address", values.address);
    formData.append("creator", auth.userId);
    formData.append("image", values.image.fileList[0].originFileObj);
    try {
      const response = await fetch("http://localhost:3001/api/places", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      className="new-place-form"
      name="basic" // name of the form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input the title!" }]}
        style={{ marginBottom: "40px" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input the description!" }]}
        style={{ marginBottom: "40px" }}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input the address!" }]}
        style={{ marginBottom: "40px" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Image"
        name="image"
        style={{ marginBottom: "40px" }}
        rules={[
          {
            required: true,
            message: "Please upload your profile image!",
          },
        ]}
      >
        <Upload
          listType="picture-card"
          showUploadList={false}
          fileList={[]} //add an empty fileList prop to the Upload component to prevent the default file list from being displayed
          beforeUpload={(file) => {
            const maxSize = 5 * 1024 * 1024; // 5 MB (adjust as needed)
            if (file.size > maxSize) {
              message.error("File size must be less than 5MB");
              return false; // Prevent upload
            }
            const reader = new FileReader();
            reader.onload = () => {
              setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            return false;
          }}
          // onChange={handleImageChange}
        >
          {imagePreview ? (
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <img
                src={imagePreview}
                alt="Profile"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
              {hovering && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => setImagePreview(null)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <UploadOutlined />
              <p>Upload</p>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item style={{ marginBottom: "" }}>
        <Button type="primary" htmlType="submit" style={{ background: "red" }}>
          ADD PLACE
        </Button>
      </Form.Item>
    </Form>
  );
}
export default NewPlace;
