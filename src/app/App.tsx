import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Balance from "./components/Balance";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/">
            <Balance />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;