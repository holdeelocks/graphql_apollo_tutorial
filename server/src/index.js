const { ApolloServer } = require("apollo-server");
const isEmail = require("isemail");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { createStore } = require("./utils");
const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");
const internalEngineDemo = require("./engine");

const store = createStore();

const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store })
});

const context = async ({ req }) => {
  const auth = (req.headers && req.headers.authorization) || "";
  const email = new Buffer(auth, "base64").toString("ascii");

  if (!isEmail.validate(email)) return { user: null };

  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { user: { ...user.dataValues } };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
  playground: true,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
    ...internalEngineDemo
  }
});

if (process.env.NODE_ENV !== "test")
  server
    .listen({ port: 4000 })
    .then(() => console.log(`🚀 Server ready at ${process.env.NODE_ENV || 4000}`));

module.exports = {
  dataSources,
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  LaunchAPI,
  UserAPI,
  store,
  server
};
