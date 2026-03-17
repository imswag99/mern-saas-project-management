import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        role: {
            type: String,
            enum: ["manager", "member"],
            default: "member",
        },
    },
    { _id: false },
);

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        members: [memberSchema],
    },
    { timestamps: true },
);

const projectModel =
    mongoose.models.project || mongoose.model("project", projectSchema);

export default projectModel;
