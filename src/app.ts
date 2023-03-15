//* Imports
const cors = require("cors");
import express from "express";
import session from "express-session";
import adminRouter from "./routes/admin.route";
import authRouter from "./routes/auth.route";
import commentsRouter from "./routes/comments.route";
import feedbackRouter from "./routes/feedbacks.route";
import notFoundRouter from "./routes/not-found.route";

import usersRouter from "./routes/users.route";
import connect from "./utils/database.util";
const MongoDBStore = require("express-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/feedback-system",
  collection: "sessions",
});

store.on("error", function (error) {
  console.error(error);
});

//* Default Configurations
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

//* CORS
const ORIGINS: string[] = ["http://localhost:3000"];
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

//* Routes
app.use(cors(corsOptions));

app.use(
  require("express-session")({
    secret: "Pythonista",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", authRouter);
app.use("/admin", adminRouter);
app.use("/users", usersRouter);
app.use("/feedbacks", feedbackRouter);
app.use("/", commentsRouter);
app.use(notFoundRouter);

//* Server Running
const PORT = 9000;
connect().then(() => {
  console.info("database connection established...");
  app.listen(PORT, () => console.info(`listening on port: ${PORT}...`));
});
