import express from "express";
import {
    projectCreate,
    projectDeleteGet,
    projectDeletePost,
    projectEdit,
    projectIndex,
    projectNew,
    projectShow,
    projectUpdate,
} from "../controllers/projectsController.js";

const router = express.Router();

router.get("/", projectIndex);
router.get("/new", projectNew);
router.get("/:id", projectShow);
router.post("/", projectCreate);
router.get("/:id/edit", projectEdit);
router.put("/:id", projectUpdate);
router.get("/:id/delete", projectDeleteGet);
router.delete("/:id", projectDeletePost);

export default router;
