import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv  from 'dotenv';
import connectDB from './config/database.js'
import userRouter from './router/user.router.js';
import adminRoutes from './router/admin.router.js';

dotenv.config();
const app = express();

connectDB();





app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use("/api/user", userRouter);

app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);

});





