import React from "react";
import { Spin } from "antd"; //import the Spin component from the antd library
import "./Spinner.css";

function Spinner() {
  return (
    <div className="spinner">
      <Spin size="large" />
    </div>
  );
}

export default Spinner;
