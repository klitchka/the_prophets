import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Balance from "./components/Balance";
import Profile from "./profile/page";
import { StarknetProvider } from '@starknet-react/core';

const starknetConfig = {
  webWalletUrl: 'https://web.argent.xyz',
  // otras configuraciones de conexión a Starknet
};

function App() {
  return (
    <StarknetProvider config={starknetConfig}>
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
    </StarknetProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));