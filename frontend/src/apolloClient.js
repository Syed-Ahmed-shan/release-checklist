import { ApolloClient, InMemoryCache } from "@apollo/client";

// Points at our GraphQL backend. VITE_API_URL lets us swap the
// target once we deploy, without touching this file again.
const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL || "http://localhost:4000/",
  cache: new InMemoryCache(),
});

export default client;