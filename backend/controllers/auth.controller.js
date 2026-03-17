import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please use a valid email",
            });
        }

        const userCount = await userModel.countDocuments();

        const hashedPassword = await bcrypt.hash(password, 10);

        const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";
        
        const canCreateProject =
            email === process.env.ADMIN_EMAIL || userCount === 0;

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role,
            canCreateProject,
        });
        const user = await newUser.save();

        const token = createToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({
            success: true,
            message: "User registered successfully",
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({ success: false, message: "Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User does not exist" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({
            success: true,
            message: "User logged in successfully",
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({ success: false, message: "Error" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

export const profile = async (req, res) => {
    try {
        const currUser = await userModel
            .findById(req.user.id)
            .select("-password");
        res.json({
            success: true,
            data: {
                id: currUser._id,
                name: currUser.name,
                email: currUser.email,
                role: currUser.role,
                canCreateProject: currUser.canCreateProject,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(422).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};
