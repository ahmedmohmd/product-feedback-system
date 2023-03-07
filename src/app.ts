import cors from "cors";
import express from "express";
import feedbackRouter from "./routes/feedbacks";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
// CORS
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

app.use(cors(corsOptions));
app.use("/feedbacks", feedbackRouter);
app.use("/", (_, res) => {
  res.status(200).send("Hello from Feedbacks System!");
});
app.use((_, res) => {
  res.status(404).send("Sorry, this page does not exist!");
});

const PORT = 9000;
app.listen(PORT, () => console.info(`listening on port: ${PORT}...`));
