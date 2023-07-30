import Priority from "../models/priority.js";
import Task from "../models/task.js";

import { ObjectId } from "mongodb";

import asyncHandler from "../asyncHandler.js";

import { body, validationResult } from "express-validator";

import debug from "debug";

const logger = debug("app:prioritiesController");

export const priorityIndex = asyncHandler(async (req, res) => {
    const priorities = await Priority.find().sort({ level: 1 });
    res.render("priorities/index", { title: "Priority List", priorities });
});

export const priorityShow = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/priorities");

    const priorityTasks = await Task.find({ priority: id });
    const priority = await Priority.findById(id);

    res.render("priorities/show", { title: `Priority '${priority.name}'`, priority, priorityTasks });
});

export const priorityNew = (req, res) => {
    res.render("priorities/new", { title: "New Priority" });
};

export const priorityCreate = [
    body("password", "Incorrect Password").equals("123"),
    body("name", "Priority name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("level")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Priority level must not be empty")
        .isNumeric()
        .escape()
        .withMessage("Priority level must be a number"),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const priorityData = {
            name: req.body.name,
            level: req.body.level,
        };

        const priority = new Priority(priorityData);

        if (!errors.isEmpty()) {
            res.render("priorities/new", { title: "New Priority", priority, errors: errors.array() });
        } else {
            await priority.save();

            logger(priority);
            res.redirect(priority.url);
        }
    }),
];

export const priorityEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) res.redirect("/priorities");

    const priority = await Priority.findById(id);
    res.render("priorities/edit", { title: `Edit Priority ${id}`, priority });
});

export const priorityUpdate = [
    body("password", "Incorrect Password").equals("123"),
    body("name", "Priority name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("level")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Priority level must not be empty")
        .isNumeric()
        .escape()
        .withMessage("Priority level must be a number"),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        const priorityData = {
            name: req.body.name,
            level: req.body.level,
            _id: id,
        };

        if (!errors.isEmpty()) {
            const priority = new Priority(priorityData);
            res.render("priorities/edit", {
                title: `Edit Priority ${id}`,
                priority,
                errors: errors.array(),
            });
        } else {
            const priority = await Priority.findById(id);

            priority.set(priorityData);

            await priority.save();

            logger(priority);
            res.redirect(priority.url);
        }
    }),
];

export const priorityDeleteGet = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/projects");

    const priority = await Priority.findById(id, "name");

    res.render("priorities/delete", { title: `Delete Priority '${priority.name}'`, priority });
});

export const priorityDeletePost = [
    body("password", "Incorrect Password").equals("123"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        if (!errors.isEmpty()) {
            const priority = await Priority.findById(id, "name");

            res.render("priorities/delete", {
                title: `Delete Priority '${priority.name}'`,
                priority,
                errors: errors.array(),
            });
        } else {
            await Task.updateMany({ priority: id }, { $unset: { priority: "" } });

            await Priority.findByIdAndDelete(id);
            res.redirect("/priorities");
        }
    }),
];
