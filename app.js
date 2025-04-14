const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv/config');

const RequirementRouter = require('./src/routes/RequirementRouter');
const KnowledgeRouter = require('./src/routes/KnowledgeRouter');
const authRouter = require("./src/routes/auth");
const featureRouter = require('./src/routes/FeatureRouter');
const connectDatabase = require('./src/config/databaseConnect');
const ChatMessage = require('./src/models/ChatMessage');

const app = express();

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // React frontend port
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// Routers
app.use("/api", RequirementRouter);
app.use("/", KnowledgeRouter);
app.use("/", authRouter);
app.use("/", featureRouter);


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a specific feature's room
    socket.on('joinFeatureChat', async (featureId) => {
        socket.join(featureId);
        try {
            const history = await ChatMessage.find({ featureId }).sort({ timestamp: 1 });
            socket.emit('chatHistory', { featureId, messages: history });
        } catch (err) {
            console.error("Error fetching chat history:", err);
        }
    });

    // Save and broadcast message in that feature room
    socket.on('sendMessage', async ({ featureId, user, text }) => {
        try {
            const newMessage = new ChatMessage({ featureId, user, text });
            await newMessage.save();
            io.to(featureId).emit('newMessage', { featureId, message: newMessage });
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


const port = process.env.PORT || 4000;

connectDatabase()
    .then(() => {
        console.log(`Database connected`);

        // ❗ IMPORTANT: Use server.listen here
        server.listen(port, () => {
            console.log(`Server (HTTP + Socket.IO) is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(`Unable to connect to database: ${err}`);
    });
