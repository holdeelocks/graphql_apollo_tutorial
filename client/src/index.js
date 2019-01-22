import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

const link = new HttpLink({
  uri: "https://graphql-holden.herokuapp.com/"
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

client
  .query({
    query: gql`
      query GetLaunch {
        launch(id: 56) {
          id
          mission {
            name
          }
        }
      }
    `
  })
  .then(res => console.log(res));
