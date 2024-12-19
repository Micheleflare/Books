import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js'; // We'll remove this since we'll be using GraphQL
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './services/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
  });
};

startApolloServer();
