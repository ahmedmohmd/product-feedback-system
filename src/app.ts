//* Imports
const cors = require("cors");
import express from "express";
import session from "express-session";
import path from "path";
import config from "../config/config";
import adminRouter from "./routes/admin.route";
import authRouter from "./routes/auth.route";
import commentsRouter from "./routes/comments.route";
import errorHanlderRouter from "./routes/error-handler.route";
import feedbackRouter from "./routes/feedbacks.route";
import homeRouter from "./routes/home.route";
import notFoundRouter from "./routes/not-found.route";
import usersRouter from "./routes/users.route";
import upload from "./services/file-upload.service";
import connect from "./utils/database.util";

//* Default Configurations
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//* Surfing Static Files
app.use("/images", express.static(path.join(__dirname, "images")));

//* CORS
const ORIGINS: string[] = [config.frontendUrl, "*"];
const corsOptions = {
  // origin: function (origin: any, callback: any) {
  //   const isOrigin: boolean = ORIGINS.indexOf(origin) !== -1;
  //   if (isOrigin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  origin: "*",
};

app.use(cors(corsOptions));

app.use(upload);

//* Original Routes
app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/user", usersRouter);
app.use("/feedbacks", feedbackRouter);
app.use("/", commentsRouter);
app.use(notFoundRouter);
app.use(errorHanlderRouter);

//* Server Running
const PORT = 9000;
connect().then(() => {
  console.info("database connection established...");
  app.listen(PORT, () => console.info(`listening on port: ${PORT}...`));
});
