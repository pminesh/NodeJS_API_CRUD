import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import { graphqlHTTP } from "express-graphql";
import { graphqlSchema } from "./server/graphql/schema/schema.js";
import { graphqlResolvers } from "./server/graphql/resolvers/resolvers.js";
import { connectDB } from './server/database/connections.js';
import { router } from "./server/routes/employee_routes.js";

const app = express();
//Start GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
)
// End GraphQL

// Start Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.2',
    servers:[
      {url: 'http://localhost:3000',description: "Local server",}
    ],
    tags: [
      {
        name: "CRUD operations", // name of a tag
        "description": "API for employee in the system",
      },
    ],
    info: {
      title: 'Demo Swagger API',
      version: '1.0.0',
      description: 'Demo CRUD API',
      contact: {
        name: 'Demo Project'
      },
      servers: ["http://localhost:3000"]
    }
  },
  apis: ["./server/routes/employee_routes.js"]
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
//End Swagger

dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080

app.use(morgan('tiny'));

// mongodb connection
connectDB();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', router);

app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });
