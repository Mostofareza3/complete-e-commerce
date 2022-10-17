import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from 'react-router-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { Badge, Nav } from "react-bootstrap";
import { useContext } from "react";
import { Store } from "./context/Store";
import CartScreen from "./screens/CartScreen";

function App() {

  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <Router>
      <div className="d-flex flex-column site-container">
        <header >
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>amazon</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {
                    cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</Badge>
                    )
                  }
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Switch>
              <Route path="/product/:slug"> <ProductScreen /> </Route>
              <Route path="/cart" > <CartScreen /></Route>
              <Route path="/" > <HomeScreen /></Route>
            </Switch>
          </Container>

        </main>
        <footer>
          <div className="text-center">All rights reserved Mostofa Reza</div>
        </footer>
      </div>
    </Router>

  );
}

export default App;
