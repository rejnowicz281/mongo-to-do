import express from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";

import prioritiesRouter from "./routes/priorities.js";
import projectsRouter from "./routes/projects.js";
import tasksRouter from "./routes/tasks.js";

const app = express();

// connect to mongodb && listen for requests
const URI = "mongodb+srv://rejnowicz281:123@nodetuts.gvvxv5y.mongodb.net/mongo-to-do?retryWrites=true&w=majority";
mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000);
        console.log("Connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

// view engine setup
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

app.use((req, res) => {
    res.status(500).render("error", { title: "500" });
});
