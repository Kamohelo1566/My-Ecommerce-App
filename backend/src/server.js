import express from 'express';
import path from 'path';
//clerk
import {clerkMiddleware} from '@clerk/express';

import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

import {ENV} from "./config/env.js";
//database connection method
import {connectDB} from "./config/db.js";

//import 
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

const __dirname = path.resolve()

//calling the middleware
//to check authentication and authorization of the user
app.use(express.json());
app.use(clerkMiddleware()); //req.auth

app.use("/api/inngest", serve({client: inngest, functions}));

//admin.route.js
app.use("/api/admin",adminRoutes);

app.use("/api/users",userRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "success" });
});

//make our app ready for deployment

if (ENV.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname,"../admin/dist")));

  app.get("/{*any}", (req, res)=> {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

const startServer = async () => {
    //database connection method
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("Server is running !");
 
});
};

startServer();