import express from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";

const app = express();

// connect to mongodb && listen for requests
const URI = "mongodb+srv://rejnowicz281:123@nodetuts.gvvxv5y.mongodb.net/mongo-to-do?retryWrites=true&w=majority";
mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
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
