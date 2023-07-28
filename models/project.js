import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
    {
        name: { type: String, required: true, maxLength: 100 },
        description: { type: String, maxLength: 100 },
    },
    { timestamps: true }
);

// Virtual for project's URL
ProjectSchema.virtual("url").get(function () {
    return `/projects/${this._id}`;
});

// Export model
export default mongoose.model("Project", ProjectSchema);
