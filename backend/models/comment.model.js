import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "task",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { timestamps: true },
);

const commentModel = mongoose.model.comment || mongoose.model("comment", commentSchema);

export default commentModel;