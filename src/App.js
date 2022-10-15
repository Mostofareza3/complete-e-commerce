import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";

function App() {
  return (
    <Router>
      <div>
        <header >
          <a href="/">amazon</a>
        </header>
        <main>
          <Switch>
            <Route path="/product/:slug"> <ProductScreen /> </Route>
            <Route path="/" > <HomeScreen /></Route>
          </Switch>

        </main>
      </div>
    </Router>

  );
}

export default App;
