import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { user } from './src/utils/dataList.js';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// 스키마 정의

const typeDefs = `#graphql
  type Query {
    users: [UserList],
    hello: String
  }

  type UserList {
    userId: ID,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    emailAddress: String,
    homepage: String,
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
// 쿼리 호출
const resolvers = {
  Query: {
    users: () => user,
    hello: () => "hello"
  },
};




// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);