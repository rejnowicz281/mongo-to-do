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

    const projectTasks = await Task.find({ project: id });
    const project = await Project.findById(id);

    res.render("projects/show", { title: `${project.name}`, project, projectTasks });
});

export const projectNew = (req, res) => {
    res.render("projects/new", { title: "New Project" });
};

export const projectCreate = [
    body("password", "Incorrect Password").equals("123"),
    body("name", "Project name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description").optional({ checkFalsy: true }).trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const projectData = {
            name: req.body.name,
            description: req.body.description || undefined,
        };

        const project = new Project(projectData);

        if (!errors.isEmpty()) {
            res.render("projects/new", { title: "New Project", project, errors: errors.array() });
        } else {
            await project.save();

            console.log(project);
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
    body("password", "Incorrect Password").equals("123"),
    body("name", "Project name must not be empty").trim().isLength({ min: 1 }).escape(),
    body("description").optional({ checkFalsy: true }).trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        const projectData = {
            name: req.body.name,
            description: req.body.description || undefined,
            _id: id,
        };

        if (!errors.isEmpty()) {
            res.render("projects/edit", {
                title: "Edit Project",
                project: new Project(projectData),
                errors: errors.array(),
            });
        } else {
            const project = await Project.findById(id);

            project.set(projectData);

            await project.save();

            console.log(project);
            res.redirect(project.url);
        }
    }),
];

export const projectDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/projects");

    await Task.deleteMany({ project: id });

    await Project.findByIdAndDelete(id);
    res.redirect("/projects");
});
