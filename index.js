import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js'
import userRouter from './router/user.router.js';
import adminRoutes from './router/admin.router.js';
import postRoutes from './router/blog.router.js';
import otpRoutes from './router/otp.router.js';


dotenv.config();
const app = express();

connectDB();





app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use("/api/user", userRouter);

app.use("/api/admin", adminRoutes);


app.use("/api/posts", postRoutes);


app.use('/api/otp', otpRoutes);


app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);

});





