require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({ typeDefs, resolvers });

async function start() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },
  });
  console.log(`🚀 ReleaseCheck API ready at ${url}`);
}

start();