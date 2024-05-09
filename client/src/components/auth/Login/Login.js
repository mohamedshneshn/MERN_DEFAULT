import React, { useState, useContext } from "react";
import "./Login.css";
import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../../shared/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/AuthContext/AuthContext";

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const responseData = await response.json();

      if (response.ok) {
        setIsLoading(false);
        auth.login(responseData.userId, responseData.token);
        navigate("/");
      } else {
        setIsLoading(false);
        alert(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        {isLoading && <Spinner />}
        <Form
          name="basic"
          initialValues={{ remember: true }}
          layout="vertical"
          className="login__form"
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="login__actions">
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "red" }}
            >
              Login
            </Button>
            <Link to="/register" className="register-link">
              Not a member? Sign up now
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
