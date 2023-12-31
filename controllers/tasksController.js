import Note from "../models/note.js";
import Priority from "../models/priority.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

import { ObjectId } from "mongodb";

import asyncHandler from "../asyncHandler.js";

import { body, validationResult } from "express-validator";

import debug from "debug";

const logger = debug("app:tasksController");

export const taskIndex = asyncHandler(async (req, res) => {
    const tasks = await Task.find().sort({ name: 1 });
    res.render("tasks/index", { title: "Task List", tasks });
});

export const taskShow = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/tasks");

    const task = await Task.findById(id).populate("project", "name").populate("priority", "name");
    const taskNotes = await Note.find({ task: id }, { task: 0 });

    res.render("tasks/show", { title: `Task '${task.name}'`, task, taskNotes });
});

export const taskNew = asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ name: 1 });
    const priorities = await Priority.find().sort({ name: 1 });

    res.render("tasks/new", { title: "New Task", projects, priorities });
});

export const taskCreate = [
    body("password", "Incorrect Password").equals("123"),
    body("name", "Task name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description").optional({ checkFalsy: true }).trim().escape(),
    body("project", "Project must not be empty").trim().isLength({ min: 1 }).escape(),
    body("deadline").optional({ checkFalsy: true }).toDate(),
    body("priority").optional({ checkFalsy: true }).trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const taskData = {
            name: req.body.name,
            project: req.body.project,
            description: req.body.description || undefined,
            deadline: req.body.deadline || undefined,
            priority: req.body.priority || undefined,
        };

        const task = new Task(taskData);

        if (!errors.isEmpty()) {
            const projects = await Project.find().sort({ name: 1 });
            const priorities = await Priority.find().sort({ name: 1 });

            res.render("tasks/new", {
                title: "New Task",
                task,
                projects,
                priorities,
                errors: errors.array(),
            });
        } else {
            await task.save();

            logger(task);
            res.redirect(task.url);
        }
    }),
];

export const taskEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/tasks");

    const task = await Task.findById(id);

    const projects = await Project.find().sort({ name: 1 });
    const priorities = await Priority.find().sort({ name: 1 });

    res.render("tasks/edit", { title: `Edit Task ${id}`, task, projects, priorities });
});

export const taskUpdate = [
    body("password", "Incorrect Password").equals("123"),
    body("name", "Task name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description").optional({ checkFalsy: true }).trim().escape(),
    body("project", "Project must not be empty").trim().isLength({ min: 1 }).escape(),
    body("deadline").optional({ checkFalsy: true }).toDate(),
    body("priority").optional({ checkFalsy: true }).trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        const taskData = {
            name: req.body.name,
            project: req.body.project,
            description: req.body.description || undefined,
            deadline: req.body.deadline || undefined,
            priority: req.body.priority || undefined,
            _id: id,
        };

        if (!errors.isEmpty()) {
            const projects = await Project.find().sort({ name: 1 });
            const priorities = await Priority.find().sort({ name: 1 });

            res.render("tasks/edit", {
                title: `Edit Task ${id}`,
                task: new Task(taskData),
                projects,
                priorities,
                errors: errors.array(),
            });
        } else {
            const task = await Task.findById(id);

            task.set(taskData);

            await task.save();

            logger(task);
            res.redirect(task.url);
        }
    }),
];

export const taskDeleteGet = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/tasks");

    const task = await Task.findById(id, "name");

    res.render("tasks/delete", { title: `Delete Task '${task.name}'`, task });
});

export const taskDeletePost = [
    body("password", "Incorrect Password").equals("123"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        if (!errors.isEmpty()) {
            const task = await Task.findById(id, "name");

            res.render("tasks/delete", { title: `Delete Task '${task.name}'`, task, errors: errors.array() });
        } else {
            await Note.updateMany({ task: id }, { $unset: { task: "" } });

            await Task.findByIdAndDelete(id);
            res.redirect("/tasks");
        }
    }),
];

export const toggleTaskComplete = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/tasks");

    const task = await Task.findById(id);

    task.set({ completed: !task.completed });

    await task.save();

    logger(task);
    res.redirect(task.url);
});
