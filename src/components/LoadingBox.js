import React from "react";
import { Spinner } from "react-bootstrap";
import "../styles/HomeScreen.css";

const LoadingBox = () => {
  return (
    <div className="d-block">
      <Spinner animation="border spinner  d-block " role="status">
        <span className="visually-hidden d-block">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingBox;
