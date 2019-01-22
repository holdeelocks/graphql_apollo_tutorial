import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";

import { resolvers, typeDefs } from "./resolvers";
import Pages from "./pages";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers: {
      authorization: localStorage.getItem("token")
    }
  }),
  initializers: {
    isLoggedIn: () => !!localStorage.getItem("token"),
    cartItems: () => []
  },
  resolvers,
  typeDefs
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById("root")
);
