import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "project",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["todo", "in-progress", "review", "done"],
            default: "todo",
            index: true,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        labels: [
            {
                type: String,
                trim: true,
            },
        ],

        order: {
            type: Number,
            default: 0,
            index: true,
        },
    },
    {
        timestamps: true,
    },
);

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ projectId: 1, priority: 1 });
taskSchema.index({ projectId: 1, assignedTo: 1 });
taskSchema.index({ projectId: 1, dueDate: 1 });
taskSchema.index({ title: "text" });

const taskModel = mongoose.models.task || mongoose.model("task", taskSchema);
export default taskModel;
