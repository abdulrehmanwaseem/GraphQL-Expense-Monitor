import express from "express";
import "dotenv/config.js";
import cors from "cors";
import http from "http";
import compression from "compression";

import passport from "passport";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { buildContext } from "graphql-passport";

import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import connectToDatabase from "./config/db/dbConnection.js";
import { configurePassport } from "./config/passport/passport.config.js";
import globalErrorHandler from "./lib/globalErrorHandler.js";

const app = express();
configurePassport();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // Graceful shutdown
});

const PORT = process.env.PORT;

await server.start();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, `http://localhost:${PORT}`],
    credentials: true,
  })
);
app.use(compression({ threshold: 1024 }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  "/", // Route for the GraphQL server
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }), // Context middleware
  })
);

app.use(globalErrorHandler);

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
await connectToDatabase();
console.log(`🚀 Server ready at http://localhost:${PORT}/`);
