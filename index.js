import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js'
import userRouter from './router/user.router.js';
import adminRoutes from './router/admin.router.js';
import postRoutes from './router/blog.router.js';
import otpRoutes from './router/otp.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { Post } from './models/blog.model.js';



dotenv.config();
const app = express();

connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));






app.use("/api/user", userRouter);

app.use("/api/admin", adminRoutes);


app.use("/api/posts", postRoutes);


app.use('/api/otp', otpRoutes);



app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "email").lean();
    res.render("pages/posts", { title: "Home Page", posts });
  } catch (err) {
    console.error(err);
    res.render("pages/posts", { title: "Home Page", posts: [] });
  }
});


app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);

});





