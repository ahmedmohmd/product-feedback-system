import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, path.join(process.cwd() + "/src/images/"));
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (_, file, cb) => {
  const isValidFile =
    file.mimetype === "image/jpeg" || file.mimetype === "image/png";

  cb(null, isValidFile);
};

const upload = multer({
  storage,
  fileFilter,
}).single("image");

export default upload;
