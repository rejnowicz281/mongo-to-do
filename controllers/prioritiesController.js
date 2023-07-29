import Priority from "../models/priority.js";
import Task from "../models/task.js";

import { ObjectId } from "mongodb";

import asyncHandler from "../asyncHandler.js";

import { body, validationResult } from "express-validator";

export const priorityIndex = asyncHandler(async (req, res) => {
    const priorities = await Priority.find().sort({ level: 1 });
    res.render("priorities/index", { title: "Priority List", priorities });
});

export const priorityShow = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/priorities");

    const priorityTasks = await Task.find({ priority: id });
    const priority = await Priority.findById(id);

    res.render("priorities/show", { title: `${priority.name}`, priority, priorityTasks });
});

export const priorityNew = (req, res) => {
    res.render("priorities/new", { title: "New Priority" });
};

export const priorityCreate = [
    // validate and sanitize name
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

            console.log(priority);
            res.redirect(priority.url);
        }
    }),
];

export const priorityEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) res.redirect("/priorities");

    const priority = await Priority.findById(id);
    res.render("priorities/edit", { title: "Edit Priority", priority });
});

export const priorityUpdate = [
    // validate and sanitize name
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
            res.render("priorities/edit", {
                title: "Edit Priority",
                priority: new Priority(priorityData),
                errors: errors.array(),
            });
        } else {
            const priority = await Priority.findById(id);

            priority.set(priorityData);

            await priority.save();

            console.log(priority);
            res.redirect(priority.url);
        }
    }),
];

export const priorityDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/projects");

    await Task.updateMany({ priority: id }, { $unset: { priority: "" } });

    await Priority.findByIdAndDelete(id);
    res.redirect("/priorities");
});
