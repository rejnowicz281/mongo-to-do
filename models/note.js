import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
    {
        title: { type: String, maxLength: 100 },
        text: { type: String, maxLength: 1000, required: true },
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        image: String,
    },
    { timestamps: true }
);

// Virtual for note's URL
noteSchema.virtual("url").get(function () {
    return `/notes/${this._id}`;
});

// Export model
export default mongoose.model("Note", noteSchema);
