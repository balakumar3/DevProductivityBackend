const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, role, gender } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        //   Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            role,
            gender
        });
        await user.save();
        res.json({ message: "User Added successfully!" });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        console.log("herer ")
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();

            res.send({ emailId: user.emailId, token, role: user.role });
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout is successfull!!");
});

// GET all users
authRouter.get("/users", async (req, res) => {
    console.log("here get")
    try {
        const users = await User.find({}, "-__v"); // exclude __v
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update a user by ID
authRouter.put("/users/:id", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, role, gender, status, completedTasks,
            pendingTasks, overdueTasks, avgCompletionTime, teamName
        } = req.body;

        const updatedFields = {
            firstName,
            lastName,
            emailId,
            role,
            gender,
            status,
            completedTasks,
            pendingTasks,
            overdueTasks,
            avgCompletionTime,
            teamName
        };

        // Optional: only update password if provided
        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE user by ID
authRouter.delete("/users/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

authRouter.get("/users/:emailId", async (req, res) => {
    const { emailId } = req.params;

    try {
        const user = await User.findOne(
            { emailId },
            "emailId completedTasks pendingTasks overdueTasks avgCompletionTime" // projection
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user metrics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.get("/users/teams/:emailId", async (req, res) => {
    try {
        const { emailId } = req.params;

        // Find the user to get their teamName
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const teamName = user.teamName;

        // Get all users with the same teamName
        const teamMembers = await User.find({ teamName });

        // Return the members array inside an object
        res.json({ members: teamMembers });
    } catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = authRouter;