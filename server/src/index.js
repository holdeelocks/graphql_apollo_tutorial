const { ApolloServer } = require("apollo-server-express");
const isEmail = require("isEmail");
const express = require("express");

const typeDefs = require("./schema");
const { createStore } = require("./utils");
const LaunchAPI = require("./datasources/launch");
const UserAPi = require("./datasources/user");
const resolvers = require("./resolvers");

const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");

    if (!isEmail.validate(email)) return { user: null };

    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0] : null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPi({ store })
  }),
  playground: {
    endpoint: `https://graphql-holden.herokuapp.com/`,
    settings: {
      "editor.theme": "dark"
    }
  },
  engine: {
    apiKey: "service:holdeelocks:XtKdhrE7hs8TTDdXFGJ09w"
  },
  introspection: true
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT || 4000 }, () => {
  console.log(`🚀 Server ready at ${process.env.PORT || 4000}`);
});
