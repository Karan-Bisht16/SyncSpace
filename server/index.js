import "dotenv/config";
import cors from "cors";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const env = process.env.NODE_ENV;
console.log(env);

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/uploads"));
app.use(cookieParser());

import connection from "./database.js";
connection();

const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

import userRoutes from "./routes/user.routes.js";
app.use("/user", userRoutes);
import subspaceRoutes from "./routes/subspace.routes.js";
app.use("/subspace", subspaceRoutes);
import postRoutes from "./routes/post.routes.js";
app.use("/post", postRoutes);
import commentRoutes from "./routes/comment.routes.js";
app.use("/comment", commentRoutes);

app.listen(PORT, () => {
    console.log(`Server working on PORT ${PORT}.`);
});