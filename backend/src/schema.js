// GraphQL type definitions (SDL). This is the contract between
// frontend and backend: every field the UI can query or mutate
// is declared here.
const typeDefs = `#graphql
  enum ReleaseStatus {
    PLANNED
    ONGOING
    DONE
  }

  type Step {
    key: String!
    label: String!
    completed: Boolean!
  }

  type Release {
    id: ID!
    name: String!
    date: String!
    status: ReleaseStatus!
    additionalInfo: String
    steps: [Step!]!
    createdAt: String!
  }

  type Query {
    releases: [Release!]!
    release(id: ID!): Release
  }

  type Mutation {
    createRelease(name: String!, date: String!, additionalInfo: String): Release!
    updateRelease(id: ID!, name: String, date: String, additionalInfo: String): Release!
    toggleStep(id: ID!, stepKey: String!, completed: Boolean!): Release!
    deleteRelease(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;