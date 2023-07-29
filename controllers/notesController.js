import Note from "../models/note.js";
import Task from "../models/task.js";

import { ObjectId } from "mongodb";

import asyncHandler from "../asyncHandler.js";

import { body, validationResult } from "express-validator";
import { existsSync, unlinkSync } from "fs";

export const noteIndex = asyncHandler(async (req, res) => {
    const notes = await Note.find().sort({ title: 1 });
    res.render("notes/index", { title: "Note List", notes });
});

export const noteShow = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/notes");

    const note = await Note.findById(id).populate("task", "name");

    res.render("notes/show", { title: `Note ${note.id}`, note });
});

export const noteNew = asyncHandler(async (req, res) => {
    const tasks = await Task.find();

    res.render("notes/new", { title: "New Note", tasks });
});

export const noteCreate = [
    body("title").optional({ checkFalsy: true }).trim().escape(),
    body("text", "Note text must not be empty").trim().isLength({ min: 1 }).escape(),
    body("image").optional({ checkFalsy: true }).trim().escape(),
    body("task").optional({ checkFalsy: true }).trim().escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const noteData = {
            title: req.body.title || undefined,
            text: req.body.text,
            task: req.body.task || undefined,
        };

        if (req.file) noteData.image = `/uploads/${req.file.filename}`;
        if (req.body.deleteImage) noteData.image = undefined;

        const note = new Note(noteData);

        if (!errors.isEmpty()) {
            console.log(note);
            const tasks = await Task.find();

            res.render("notes/new", {
                title: "New Note",
                note,
                tasks,
                errors: errors.array(),
            });
        } else {
            await note.save();

            console.log(note);
            res.redirect(note.url);
        }
    }),
];

export const noteEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/notes");

    const note = await Note.findById(id);
    const tasks = await Task.find();

    res.render("notes/edit", { title: "Edit Note", note, tasks });
});

export const noteUpdate = [
    body("title").optional({ checkFalsy: true }).trim().escape(),
    body("text", "Note text must not be empty").trim().isLength({ min: 1 }).escape(),
    body("task").optional({ checkFalsy: true }).trim().escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        const noteData = {
            title: req.body.title || undefined,
            text: req.body.text,
            task: req.body.task || undefined,
            _id: id,
        };

        if (!errors.isEmpty()) {
            const tasks = await Task.find();

            res.render("notes/edit", {
                title: "Edit Note",
                note: new Note(noteData),
                tasks,
                errors: errors.array(),
            });
        } else {
            const note = await Note.findById(id);

            if (req.file) noteData.image = `/uploads/${req.file.filename}`;
            if (req.body.deleteImage) noteData.image = undefined;

            note.set(noteData);

            await note.save();

            console.log(note);
            res.redirect(note.url);
        }
    }),
];

export const noteDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/notes");

    const note = await Note.findById(id);

    if (note.image) {
        const imageFileExists = existsSync(`public${note.image}`);

        if (imageFileExists) unlinkSync(`public${note.image}`);
    }

    await Note.findByIdAndDelete(id);

    res.redirect("/notes");
});
