import express from "express";
import bodyParser from "body-parser";
import dbConnect from "./dbConfig/config.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import suEnRouter from "./routes/suEnRouter.js";
import childrenRouter from "./routes/childrenRouter.js";
import absentRouter from './routes/absentRouter.js';
import router from "./middleware/uploadFile.js";
import weeklyGoalRouter from './routes/weeklyGoalRouter.js';
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 7000;
// http://localhost:8080
// http://localhost:5173
// https://nouveau-project.vercel.app
dbConnect();
app.use(bodyParser.json());
app.use(cors(
    {
        origin: ["http://localhost:5173", "https://projet-cde213.vercel.app"],
        methods:["POST", "GET","DELETE","PUT"],
        credentials:true
    }
));
app.get("/",(req,res)=>{
    res.json("Hello")
})
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Corrected route definition
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/user', suEnRouter);
app.use('/child', childrenRouter);
app.use('/absent', absentRouter);
app.use('/profile', router);
app.use('/week', weeklyGoalRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});

// import express from "express";
// import bodyParser from "body-parser";
// import dbConnect from "./dbConfig/config.js";
// import dotenv from "dotenv";
// import userRouter from "./routes/userRouter.js";
// import adminRouter from "./routes/adminRouter.js";
// import suEnRouter from "./routes/suEnRouter.js";
// import childrenRouter from "./routes/childrenRouter.js";
// import absentRouter from './routes/absentRouter.js';
// import router from "./middleware/uploadFile.js";
// import weeklyGoalRouter from './routes/weeklyGoalRouter.js';
// import messageRouter from './routes/messageRouter.js'
// import cors from "cors";
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import http from "http";   // Import the HTTP module
// import { Server } from "socket.io";  // Import Socket.IO server

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// dotenv.config();  // Load environment variables

// const app = express();
// const server = http.createServer(app);  // Create an HTTP server
// const io = new Server(server, {
//     cors: {
//         origin: ["https://projet-cde213.vercel.app"],
//         methods: ["POST", "GET"],
//         credentials: true
//     }
// });
// const PORT = process.env.PORT || 7000;
// // http://localhost:5173
// // https://nouveau-project.vercel.app
// // projet-cde213.vercel.app
// // https://projet-cde213.vercel.app

// dbConnect();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors({
//     origin: ["http://localhost:5173", "https://projet-cde213.vercel.app"],
//     methods: ["POST", "GET"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(join(__dirname, 'uploads')));

// // Route Definitions
// app.get("/", (req, res) => {
//     res.json("Hello");
// });
// app.use('/user', userRouter);
// app.use('/admin', adminRouter);
// app.use('/user', suEnRouter);
// app.use('/child', childrenRouter);
// app.use('/absent', absentRouter);
// app.use('/profile', router);
// app.use('/week', weeklyGoalRouter);
// app.use('/message',messageRouter)
// // Socket.IO connection handling
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // Handle custom events
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// // Start the server using `server.listen`
// server.listen(PORT, () => {
//     console.log(`Server is running at PORT ${PORT}`);
// });

// // Export the io instance for usage in other modules (optional)
// export { io };
