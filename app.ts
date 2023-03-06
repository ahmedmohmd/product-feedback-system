import cors from "cors";
import express from "express";

const app = express();
app.use(
  express.urlencoded({
    extended: false,
  })
);

// CORS
const ORIGINS: string[] = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    const isOrigin: boolean = origin.indexOf(origin) !== -1;
    if (isOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

const PORT = 9000;
app.listen(PORT, () => console.info(`listening on port: ${PORT}...`));
