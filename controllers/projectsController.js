import Project from "../models/project.js";
import Task from "../models/task.js";

import { ObjectId } from "mongodb";

import asyncHandler from "../asyncHandler.js";

import { body, validationResult } from "express-validator";

export const projectIndex = asyncHandler(async (req, res) => {
    const projects = await Project.find().sort({ name: 1 });
    res.render("projects/index", { title: "Project List", projects });
});

export const projectShow = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/projects");

    const projectTasks = await Task.find({ project: req.params.id });
    const project = await Project.findById(req.params.id);

    res.render("projects/show", { title: `${project.name}`, project, projectTasks });
});

export const projectNew = (req, res) => {
    res.render("projects/new", { title: "New Project" });
};

export const projectCreate = [
    body("name", "Project name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description").trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const project = new Project({
            name: req.body.name,
            description: req.body.description,
        });

        if (!errors.isEmpty()) {
            res.render("projects/new", { title: "New Project", project, errors: errors.array() });
        } else {
            await project.save();
            res.redirect(project.url);
        }
    }),
];

export const projectEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/projects");

    const project = await Project.findById(id);
    res.render("projects/edit", { title: "Edit Project", project });
});

export const projectUpdate = [
    body("name", "Project name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description").trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        const project = new Project({
            name: req.body.name,
            description: req.body.description,
            _id: id,
        });

        if (!errors.isEmpty()) {
            res.render("projects/edit", { title: "Edit Project", project, errors: errors.array() });
        } else {
            await Project.findByIdAndUpdate(id, project);

            res.redirect(project.url);
        }
    }),
];

export const projectDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/projects");

    await Project.findByIdAndDelete(id);
    res.redirect("/projects");
});
