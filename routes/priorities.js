import express from "express";
import {
    priorityCreate,
    priorityDelete,
    priorityEdit,
    priorityIndex,
    priorityNew,
    priorityShow,
    priorityUpdate,
} from "../controllers/prioritiesController.js";

const router = express.Router();

router.get("/", priorityIndex);
router.get("/new", priorityNew);
router.get("/:id", priorityShow);
router.post("/", priorityCreate);
router.get("/:id/edit", priorityEdit);
router.put("/:id", priorityUpdate);
router.delete("/:id", priorityDelete);

export default router;
