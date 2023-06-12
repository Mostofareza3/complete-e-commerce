import { Button, Card } from "react-bootstrap";

import Rating from "./Rating";

const PlaceHolder = () => {
  return (
    <Card className="product">
      <div className="placeholder">
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"
          }
          className="card-img-top placeholder"
          alt={""}
        />
      </div>
      <Card.Body>
        <p className="product-name">
          <Card.Title> </Card.Title>
        </p>
        <Card.Text>
          <div className="placeholder-lg"> </div>
        </Card.Text>
        <div className="product-rating-price placeholder-sm">
          <Rating />
          <Card.Text></Card.Text>
        </div>

        <Button className="btn-secondary text-dark card-button placeholder"></Button>
      </Card.Body>
    </Card>
  );
};

export default PlaceHolder;
