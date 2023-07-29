import express from "express";

import {
    noteCreate,
    noteDelete,
    noteEdit,
    noteIndex,
    noteNew,
    noteShow,
    noteUpdate,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", noteIndex);
router.get("/new", noteNew);
router.get("/:id", noteShow);
router.post("/", noteCreate);
router.get("/:id/edit", noteEdit);
router.put("/:id", noteUpdate);
router.delete("/:id", noteDelete);

export default router;
