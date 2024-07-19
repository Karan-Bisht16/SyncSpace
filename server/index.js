import "dotenv/config";
import cors from "cors";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import methodOverride from "method-override";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

import mongoose from "mongoose";
import connection from "./database.js";
connection();

const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

import MongoStore from "connect-mongo";
const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    mongooseConnection: mongoose.connection,
    ttl: 365 * 24 * 60 * 60 * 1000,
    autoRemove: "native",
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
    }
}));

import userRoutes from "./routes/userRoutes.js";
app.use("/user", userRoutes);
import postRoutes from "./routes/postRoutes.js";
app.use("/post", postRoutes);
import subspaceRoutes from "./routes/subspaceRoutes.js";
app.use("/subspace", subspaceRoutes);

app.listen(PORT, () => {
    console.log(`Server working on PORT ${PORT}.`);
});