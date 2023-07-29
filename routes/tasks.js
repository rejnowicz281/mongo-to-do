import express from "express";
import {
    taskCreate,
    taskDelete,
    taskEdit,
    taskIndex,
    taskNew,
    taskShow,
    taskUpdate,
    toggleTaskComplete,
} from "../controllers/tasksController.js";

const router = express.Router();

router.get("/", taskIndex);
router.get("/new", taskNew);
router.get("/:id", taskShow);
router.post("/", taskCreate);
router.get("/:id/edit", taskEdit);
router.put("/:id", taskUpdate);
router.delete("/:id", taskDelete);
router.put("/:id/toggleComplete", toggleTaskComplete);

export default router;
