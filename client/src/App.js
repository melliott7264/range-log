import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import Main from './pages/Main';
import Firearms from './pages/Firearms';
import SingleFirearm from './components/SingleFirearm';
import Logs from './pages/Logs';
// import Targets from './components/Targets';
// import Shots from './components/Shots';

const PORT = process.env.PORT || 3001;

let graphqlPath = `http://localhost:${PORT}/graphql`;

if (process.env.NODE_ENV === 'production') {
  graphqlPath = '/graphql';
}

const httpLink = createHttpLink({
  uri: graphqlPath,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
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
          <Navbar />
          <Switch>
            <Route exact path="/firearms" component={Firearms} />
            <Route
              exact
              path="/firearms/single/:id"
              component={SingleFirearm}
            />
            <Route exact path="/logs" component={Logs} />
            {/* <Route exact path="/logs/targets/:id" component={Targets} /> */}
            {/* <Route exact path="/logs/targets/shots/:id" component={Shots} /> */}
            <Route exact path="/" component={Main} />
          </Switch>
        </>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
