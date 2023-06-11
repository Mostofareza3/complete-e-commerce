import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

import image1 from "../images/1.jpg";
import image2 from "../images/4.jpg";
import image3 from "../images/3.jpg";

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img className="d-block w-100" src={image1} alt="carousel" />
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={image2} alt="Second slide" />

        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={image3} alt="Third slide" />

        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
