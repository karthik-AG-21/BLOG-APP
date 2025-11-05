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
import flash from 'connect-flash';
import { TokenUser } from "./middleware/tokenEjs.js";
import isAuthenticated from "./middleware/isAuthenticated.js";
import methodOverride from 'method-override';
import { Post } from './models/blog.model.js';
import { User } from './models/user.model.js';
import { Comment } from './models/comment.model.js';







dotenv.config();
const app = express();

connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(methodOverride('_method'));
app.use(TokenUser);
app.use(flash());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(cors());

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));




app.use("/api/user", userRouter);



app.use("/api/admin", adminRoutes);


app.use("/api/posts", postRoutes);


app.use('/api/otp', otpRoutes);



app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "email name").lean();
    res.render("pages/posts", { title: "Home Page", posts });
  } catch (err) {
    console.error(err);
    res.render("pages/posts", { title: "Home Page", posts: [] });
  }
});


app.get('/register', (req, res) => {
  res.render('pages/register', { error: null, success: null, redirect: false });
  //  user: req.session.user || null // your views/pages/register.ejs file
});

app.get("/login", (req, res) => {
  res.render("pages/login", { error: null, success: null, redirect: false });
});

app.get("/otpVarify", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "email name").lean();
    const user = req.user || null;

    let showVerificationModal = false;
    let showOtpModal = false;

    if (user && !user.isAccountVerified) {
      // User not verified at all
      showVerificationModal = true;
    } else if (user && user.isAccountVerified && !user.isVerified) {
      // OTP sent but not verified yet
      showOtpModal = true;
    }

    res.render("pages/otpVarify", {
      title: "Home Page",
      posts,
      user,
      showVerificationModal,
      showOtpModal,
      otpSentMessage: false,
      error: null,
      success: null,

    });

  } catch (err) {
    // const posts = await Post.find().populate("userId", "email name").lean();
    console.error(err);
    res.render("pages/otpVarify", {
      title: "Home Page",
      posts: [],
      user: null,
      showVerificationModal: false,
      showOtpModal: false,
      otpSentMessage: false,
      error: err.message || "something went wrong",
      success: false,

    });
  }
});

app.get("/userHome", isAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .lean();

    res.render("pages/userHome", { 
      title: "User Home", 
      posts, 
      user: req.user,  // Now req.user exists because of middleware
      error: null, 
      success: null 
    });
  } catch (err) {
    console.error("Error fetching posts", err);
    res.render("pages/userHome", {
      title: "User Home",
      posts: [],
      user: req.user,
      error: "Error loading posts",
      success: null
    });
  }
});

app.get("/myPosts", isAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const posts = await Post.find({ userId: userId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.render("pages/myPosts", {
    title: "My Posts",
    user: req.user,
    posts,
    error: null,
    success: null
  });
});

app.get("/adminDashboard", async (req, res) => {
  try {
    // Fetch all users from database
    const users = await User.find().lean();

    // Fetch all posts from database
     const posts = await Post.find().populate('userId', 'name email').lean();

    // Fetch all comments from database
    const comments = await Comment.find().lean();

    // Get statistics
    const totalUsers = users.length;
    const totalPosts = posts.length;
    const totalComments = comments.length;

    // GET SUCCESS/ERROR FROM QUERY PARAMETERS
    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render("pages/adminDashboard", {
      error: error,
      success: success,
      redirect: false,
      users: users,
      posts: posts,
      totalUsers: totalUsers,
      totalPosts: totalPosts,
      totalComments: totalComments
    });
  } catch (err) {
    console.error("Error fetching admin data:", err);
    res.render("pages/adminDashboard", {
      error: "Failed to load dashboard data",
      success: null,
      redirect: false,
      users: [],
      posts: [],
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);

});





