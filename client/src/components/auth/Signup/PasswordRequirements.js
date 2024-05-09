import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

const PasswordRequirements = ({ password }) => {
  const minLength = 6;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <div className="password-requirements" style={{ marginBottom: 20 }}>
      <div style={{ color: password.length >= minLength ? "green" : "red" }}>
        <CheckCircleOutlined
          style={{ marginRight: 5 }}
          className={password.length >= minLength ? "icon-green" : ""}
        />
        At least {minLength} characters
      </div>
      <div style={{ color: hasLowercase ? "green" : "red" }}>
        <CheckCircleOutlined
          style={{ marginRight: 5 }}
          className={hasLowercase ? "icon-green" : ""}
        />
        At least one lowercase letter
      </div>
      <div style={{ color: hasUppercase ? "green" : "red" }}>
        <CheckCircleOutlined
          style={{ marginRight: 5 }}
          className={hasUppercase ? "icon-green" : ""}
        />
        At least one uppercase letter
      </div>
      <div style={{ color: hasNumber ? "green" : "red" }}>
        <CheckCircleOutlined
          style={{ marginRight: 5 }}
          className={hasNumber ? "icon-green" : ""}
        />
        At least one number
      </div>
    </div>
  );
};

export default PasswordRequirements;
