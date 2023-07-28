import mongoose from "mongoose";

import { DateTime } from "luxon";

const Schema = mongoose.Schema;

const TaskSchema = new Schema(
    {
        name: { type: String, required: true, maxLength: 100 },
        description: { type: String, maxLength: 100 },
        project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        completed: { type: Boolean, default: false, required: true },
        deadline: { type: Date },
        priority: { type: Schema.Types.ObjectId, ref: "Priority" },
    },
    { timestamps: true }
);

// Virtual for task's URL
TaskSchema.virtual("url").get(function () {
    return `/tasks/${this._id}`;
});

// Virtual for task's deadline in YYYY-MM-DD format with luxon
TaskSchema.virtual("deadline_yyyy_mm_dd").get(function () {
    return this.deadline ? DateTime.fromJSDate(this.deadline).toISODate() : null;
});

// Virtual for task's createdAt field formatted with luxon
TaskSchema.virtual("createdAt_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.createdAt).toISODate();
});

// Virtual for task's updatedAt field formatted with luxon
TaskSchema.virtual("updatedAt_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.updatedAt).toISODate();
});

// Export model
export default mongoose.model("Task", TaskSchema);
