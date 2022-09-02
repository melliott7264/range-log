import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Firearm from './pages/Firearm';
import Logs from './pages/Logs';

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
          <Routes>
            <Route exact path="/firearm" component={Firearm} />
            <Route exact path="/logs" component={Logs} />
          </Routes>
        </>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
