import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Spinner from "../../shared/Spinner/Spinner";
import PasswordRequirements from "./PasswordRequirements";
import { AuthContext } from "../../shared/AuthContext/AuthContext";

function Signup() {
  const [password, setPassword] = useState(""); //create a new state variable to store the password
  const [imagePreview, setImagePreview] = useState(null); //create a new state variable to store the image preview
  const [isLoading, setIsLoading] = useState(false); //create a new state variable to store the loading state
  const [error, setError] = useState(null); //create a new state variable to store the error message

  const auth = useContext(AuthContext); //use the useContext hook to access the AuthContext
  const navigate = useNavigate(); //use the useNavigate hook to access the navigate function

  //to handle the password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onFinish = async (values) => {
    const formData = new FormData(); //create a new FormData object to store the form data
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("image", values.image.fileList[0].originFileObj); //append the image file to the form data

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/users/signup", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();

      if (response.ok) {
        setIsLoading(false);
        auth.login(responseData.userId, responseData.token);
        navigate("/");
      } else {
        setIsLoading(false);
        setError(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setError(null);
  };

  return (
    <div className="signup">
      <div className="signup__container">
        {isLoading && <Spinner />}

        <Form
          name="basic"
          initialValues={{ remember: true }}
          layout="vertical"
          className="signup__form"
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="name"
            // rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input onChange={handleInputChange} />
          </Form.Item>
          {error === "User exists already, please login instead." && (
            <p className="error-message">Username already exists</p>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input onChange={handleInputChange} />
          </Form.Item>
          {error === "User exists already, please login instead." && (
            <p className="error-message">Email already exists</p>
          )}

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password onChange={handlePasswordChange} />
          </Form.Item>
          <PasswordRequirements password={password} />
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Profile Image"
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
                const reader = new FileReader();
                reader.onload = () => {
                  setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                return false;
              }}
            >
              {imagePreview ? (
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Profile"
                    style={{ width: "100%" }}
                  />
                </div>
              ) : (
                <div>
                  <UploadOutlined />
                  <p>Upload</p>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="signup__actions">
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#ff4d4f", border: "none" }}
            >
              Sign up
            </Button>
            <Link to="/login" className="login-link">
              Already a member? Login now
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
