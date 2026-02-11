import express from "express";
import http from "http";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT

app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});