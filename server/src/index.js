const { ApolloServer } = require("apollo-server");
const isEmail = require("isEmail");
const cors = require("cors");
const helmet = require("helmet");

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
  engine: {
    apiKey: "service:holdeelocks:XtKdhrE7hs8TTDdXFGJ09w"
  },
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPi({ store })
  })
});

server.use(cors());
server.use(helmet());

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
