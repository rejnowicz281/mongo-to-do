import mongoose from "mongoose";

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

// Export model
export default mongoose.model("Task", TaskSchema);
