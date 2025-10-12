import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    if (!file) return cb(new Error("No file uploaded"));

    const ext = path.extname(file.originalname); // keep original extension
    const userId = req.user?._id; // logged-in user's ID
    if (!userId) return cb(new Error("User ID not found"));

    const filePath = path.join("uploads", `${userId}${ext}`);

    // delete old image if exists
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    cb(null, `${userId}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

export const upload = multer({ storage, fileFilter });
