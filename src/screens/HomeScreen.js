import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "./../components/LoadingBox";
import MessageBox from "./../components/MessageBox";
import { BASE_URL } from "../utils";
import "../styles/HomeScreen.css";
import ControlledCarousel from "../components/Carosel";
import PlaceholderCard from "../components/Placeolder";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`${BASE_URL}/api/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Amazon</title>
      </Helmet>
      <ControlledCarousel />
      <div className="products">
        <h1 className="heading">Featured Products</h1>
        {loading ? (
          <>
            <h5 className="text-info mx-3 d-block">
              Sorry! Taking Long time for server response. It is just because
              server deployed on Render Free server hosting platform.
            </h5>
            <LoadingBox />
            <Row>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <Col key={num} sm={6} md={4} lg={4}>
                  <PlaceholderCard />
                </Col>
              ))}
            </Row>
          </>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={6} md={4} lg={4} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
