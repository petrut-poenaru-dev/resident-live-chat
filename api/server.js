import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT
const io = new SocketIOServer(server);


app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

io.on("connection", (socket) => {
    socket.on("sendMessage", (payload) => {
        const text = payload?.text;

        const message = {
            text: text ?? "",
            time: Date.now(),
            senderId: socket.id,
        };

        io.emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log("An user has disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});