import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import session from "express-session";
const __dirname = dirname(fileURLToPath(import.meta.url));

import "dotenv/config";
import express from "express";
import methodOverride from "method-override";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
// app.use(express.json());
// app.use(express.urlencoded({  }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

// cors() must be present above routes
const corsOptions = {
    origin: [process.env.FRONT_END_DOMAIN_1, process.env.FRONT_END_DOMAIN_2, process.env.FRONT_END_DOMAIN_3],
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
// app.use(cors());

import mongoose from "mongoose";
import connection from "./database.js";
connection();

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
app.use("/posts", postRoutes);
import subspaceRoutes from "./routes/subspaceRoutes.js";
app.use("/subspace", subspaceRoutes);

app.listen(PORT, () => {
    console.log(`Server working on PORT ${PORT}.`);
});