#! /usr/bin/env node

console.log(
    'This script seeds the database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

import Note from "./models/note.js";
import Priority from "./models/priority.js";
import Project from "./models/project.js";
import Task from "./models/task.js";

const projects = [];
const tasks = [];
const priorities = [];
const notes = [];

import pkg from "mongoose";
const { connect, connection, set } = pkg;

set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createProjects();
    await createPriorities();
    await createTasks();
    await createNotes();
    console.log("Debug: Closing mongoose");
    connection.close();
}

async function projectCreate(index, name, description) {
    const projectDetail = { name };

    if (description != false) projectDetail.description = description;

    const project = new Project(projectDetail);

    await project.save();
    projects[index] = project;

    console.log(`Added project: ${name}`);
}

async function priorityCreate(index, name, level) {
    const priority = new Priority({ name, level });
    await priority.save();
    priorities[index] = priority;
    console.log(`Added priority: ${name}`);
}

async function taskCreate(index, name, description, project, completed, deadline, priority) {
    const taskDetail = { name, project, completed };

    if (description != false) taskDetail.description = description;
    if (deadline != false) taskDetail.deadline = deadline;
    if (priority != false) taskDetail.priority = priority;

    const task = new Task(taskDetail);

    await task.save();
    tasks[index] = task;

    console.log(`Added task: ${name}`);
}

async function noteCreate(index, title, text, task) {
    const noteDetail = { text };

    if (title != false) noteDetail.title = title;
    if (task != false) noteDetail.task = task;

    const note = new Note(noteDetail);

    await note.save();
    notes[index] = note;

    console.log(`Added note ${title ? `'${title}'` : note.id}`);
}

async function createProjects() {
    console.log("Creating projects");

    await projectCreate(0, "Project Alpha", "This is Project Alpha I");
    await projectCreate(1, "Project Beta", "This is Project Beta II");
    await projectCreate(2, "Project Gamma", "This is Project Gamma III");
    await projectCreate(3, "Project Delta", "This is Project Delta IV");
    await projectCreate(4, "Project Epsilon", "This is Project Epsilon V");
}

async function createPriorities() {
    console.log("Creating priorities");

    await priorityCreate(0, "Low", 1);
    await priorityCreate(1, "Medium", 2);
    await priorityCreate(2, "High", 3);
}

async function createTasks() {
    console.log("Creating tasks");

    await taskCreate(0, "Task 1A", "This is Task 1 of Alpha", projects[0], false, new Date(), false);
    await taskCreate(1, "Task 2A", "This is Task 2 of Alpha", projects[0], true, false, priorities[1]);
    await taskCreate(2, "Task 3A", "This is Task 3 of Alpha", projects[0], false, new Date(), priorities[2]);
    await taskCreate(3, "Task 1B", "This is Task 1 of Beta", projects[1], false, new Date(), priorities[0]);
    await taskCreate(4, "Task 2B", "This is Task 2 of Beta", projects[1], true, new Date(), false);
    await taskCreate(5, "Task 3B", "This is Task 3 of Beta", projects[1], false, false, priorities[2]);
    await taskCreate(6, "Task 1G", "This is Task 1 of Gamma", projects[2], false, false, priorities[0]);
    await taskCreate(7, "Task 2G", "This is Task 2 of Gamma", projects[2], true, new Date(), priorities[1]);
    await taskCreate(8, "Task 3G", "This is Task 3 of Gamma", projects[2], false, false, false);
    await taskCreate(9, "Task 1D", "This is Task 1 of Delta", projects[3], false, new Date(), false);
    await taskCreate(10, "Task 2D", "This is Task 2 of Delta", projects[3], false, false, priorities[1]);
    await taskCreate(11, "Task 3D", "This is Task 3 of Delta", projects[3], true, false, priorities[2]);
    await taskCreate(12, "Task 1E", "This is Task 1 of Epsilon", projects[4], false, new Date(), priorities[0]);
    await taskCreate(13, "Task 2E", "This is Task 2 of Epsilon", projects[4], true, false, false);
    await taskCreate(14, "Task 3E", "This is Task 3 of Epsilon", projects[4], false, new Date(), priorities[2]);
}

async function createNotes() {
    console.log("Creating notes");

    await noteCreate(0, "Note 1A", "Note of Task 1A", tasks[0]);
    await noteCreate(1, false, "Note of Task 2A", tasks[1]);
    await noteCreate(2, "Note 3A", "Note of Task 3A", tasks[2]);
    await noteCreate(3, false, "Note of Task 1B", tasks[3]);
    await noteCreate(4, "Note 2B", "Note of Task 2B", tasks[4]);
    await noteCreate(5, false, "Independent Note.... JDSAODASKDASDKA", false);
    await noteCreate(6, "Note 1G", "Note of Task 1G", tasks[6]);
    await noteCreate(7, "Note 2G", "Note of Task 2G", tasks[7]);
    await noteCreate(8, false, "Note of Task 3G", tasks[8]);
    await noteCreate(9, "A simple note", "Note about nothing in particular.", false);
    await noteCreate(10, "Note 2D", "Note of Task 2D", tasks[10]);
    await noteCreate(11, false, "Independent Note... 12321321321321321321321321", false);
    await noteCreate(12, "Note 1E", "Note of Task 1E", tasks[12]);
    await noteCreate(13, false, "Note of INDEPENDENCE.... ASDMIASDJASIODASKODIK", false);
    await noteCreate(14, "Note 3E", "Note of Task 3E", tasks[14]);
}
