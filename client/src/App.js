import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  // useMutation,
} from "@apollo/client";
// import { ADD_FIREARM, EDIT_FIREARM, REMOVE_FIREARM } from "../utils/mutations";
import { setContext } from "@apollo/client/link/context";

import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import Main from "./pages/Main";
import Firearms from "./pages/Firearms";
import SingleFirearm from "./components/SingleFirearm";
import Logs from "./pages/Logs";
import Targets from "./components/Targets";
import Shots from "./components/Shots";
import SingleShot from "./components/SingleShot";

// import services for indexedDB database for offline storage
// import { db, init } from "./utils/offline";

//This is a test of the client side .env
// console.log(process.env.REACT_APP_CLIENT_SIDE_TEST);

const PORT = process.env.PORT || 3001;

let graphqlPath = `http://localhost:${PORT}/graphql`;

if (process.env.NODE_ENV === "production") {
  graphqlPath = "/graphql";
}

const httpLink = createHttpLink({
  uri: graphqlPath,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {

  return (
    <ApolloProvider client={client}>
      <Router forceRefresh={true}>
        <>
          <div className="page-container">
            <Navbar />
            <Switch>
              <Route exact path="/firearms" component={Firearms} />
              <Route
                exact
                path="/firearms/single/:id"
                component={SingleFirearm}
              />
              <Route exact path="/logs" component={Logs} />
              <Route exact path="/logs/targets/:date" component={Targets} />
              <Route
                exact
                path="/logs/targets/shots/:date&:target&:numberTargets"
                component={Shots}
              />
              <Route
                exact
                path="/logs/targets/shots/shot/:date&:target&:numberTargets&:shot&:firearmId"
                component={SingleShot}
              />
              <Route exact path="/" component={Main} />
              <Redirect to="/" />
            </Switch>
          </div>
        </>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
