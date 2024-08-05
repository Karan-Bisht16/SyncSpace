import "dotenv/config";
import cors from "cors";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

// import mongoose from "mongoose";
import connection from "./database.js";
connection();

const corsOptions = {
    origin: true, 
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

import userRoutes from "./routes/userRoutes.js";
app.use("/user", userRoutes);
import subspaceRoutes from "./routes/subspaceRoutes.js";
app.use("/subspace", subspaceRoutes);
import postRoutes from "./routes/postRoutes.js";
app.use("/post", postRoutes);
import commentRoutes from "./routes/commentRoutes.js";
app.use("/comment", commentRoutes);

app.listen(PORT, () => {
    console.log(`Server working on PORT ${PORT}.`);
});