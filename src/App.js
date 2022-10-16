import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from 'react-router-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column site-container">
        <header >
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>amazon</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Switch>
              <Route path="/product/:slug"> <ProductScreen /> </Route>
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
