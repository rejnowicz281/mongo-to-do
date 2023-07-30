import compression from "compression";
import debug from "debug";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import methodOverride from "method-override";
import mongoose from "mongoose";

import notesRouter from "./routes/notes.js";
import prioritiesRouter from "./routes/priorities.js";
import projectsRouter from "./routes/projects.js";
import tasksRouter from "./routes/tasks.js";

const app = express();

const logger = debug("app:db");

// connect to mongodb && listen for requests
const URI =
    process.env.MONGOD_URI ||
    "mongodb+srv://rejnowicz281:123@nodetuts.gvvxv5y.mongodb.net/mongo-to-do?retryWrites=true&w=majority";
mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000);
        logger("Connected to DB");
    })
    .catch((err) => {
        logger(err);
    });

// middleware and static files
app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 20,
    })
);
app.use(compression());
app.use(helmet());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// routes
app.get("/", (req, res) => {
    res.redirect("/tasks");
});

app.use("/priorities", prioritiesRouter);
app.use("/projects", projectsRouter);
app.use("/tasks", tasksRouter);
app.use("/notes", notesRouter);

app.use((req, res) => {
    res.status(500).render("error", { title: "500" });
});
