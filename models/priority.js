import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PrioritySchema = new Schema(
    {
        name: { type: String, required: true, maxLength: 100 },
        level: { type: Number, required: true, min: 1, max: 100 },
    },
    { timestamps: true }
);

// Virtual for priority's URL
PrioritySchema.virtual("url").get(function () {
    return `/priorities/${this._id}`;
});

// Export model
export default mongoose.model("Priority", PrioritySchema);
