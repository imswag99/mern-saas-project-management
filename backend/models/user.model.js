import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        canCreateProject: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    },
);

//Exporting the model
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
