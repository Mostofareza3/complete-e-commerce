import axios from "axios";
import React, { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Store } from "../context/Store";
import { BASE_URL } from "../utils";
import Rating from "./Rating";

const Product = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`${BASE_URL}/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry! Product is out of stock!");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  return (
    <Card className="product">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <p className="product-name">
          <Card.Title>{product.name} </Card.Title>
        </p>
        <Card.Text>
          {product.description.slice(0, 80)}{" "}
          <Link to={`/product/${product.slug}`}>more...</Link>
        </Card.Text>
        <div className="product-rating-price">
          <Rating rating={product.rating} />
          <Card.Text>$ {product.price}</Card.Text>
        </div>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            className="btn-secondary text-dark card-button"
            onClick={() => addToCartHandler(product)}
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
