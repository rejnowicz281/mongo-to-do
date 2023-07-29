import express from "express";
import multer from "multer";

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

router.get("/", noteIndex);
router.get("/new", noteNew);
router.get("/:id", noteShow);
router.post("/", upload.single("image"), noteCreate);
router.get("/:id/edit", noteEdit);
router.put("/:id", upload.single("image"), noteUpdate);
router.delete("/:id", noteDelete);

export default router;
