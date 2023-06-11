import React from "react";
import { Spinner } from "react-bootstrap";
import "../styles/HomeScreen.css";

const LoadingBox = () => {
  return (
    <Spinner animation="border spinner " role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default LoadingBox;
