import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import {graphqlHTTP} from "express-graphql";
import {graphqlSchema} from "./server/graphql/schema/schema.js";
import {graphqlResolvers} from "./server/graphql/resolvers/resolvers.js";
import {connectDB} from './server/database/connections.js';
import {router} from "./server/routes/employee_routes.js";

const app = express();

app.use(
    "/graphql",
    graphqlHTTP({
      schema: graphqlSchema,
      rootValue: graphqlResolvers,
      graphiql: true,
    })
  )


dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

app.use(morgan('tiny'));

// mongodb connection
connectDB();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',router);

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});