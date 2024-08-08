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

dbConnect();
app.use(bodyParser.json());
app.use(cors(
    {
        origin: ["http://nouveau-project-av75jqvr0-david-atikpos-projects.vercel.app"],
        methods:["POST", "GET"],
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
