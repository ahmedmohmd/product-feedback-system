//* Imports
const cors = require("cors");
import express from "express";
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
const ORIGINS: string[] = [config.frontendUrl];
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
app.use("/api/home", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", usersRouter);
app.use("/api/feedbacks", feedbackRouter);
app.use("/api", commentsRouter);
app.use("/api", notFoundRouter);
app.use(errorHanlderRouter);

//* Server Running
const PORT = 9000 || process.env.PORT;
connect().then(() => {
  console.info("database connection established...");
  app.listen(PORT, () => console.info(`listening on port: ${PORT}...`));
});
