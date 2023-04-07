"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* Imports
const cors = require("cors");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config/config"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const comments_route_1 = __importDefault(require("./routes/comments.route"));
const error_handler_route_1 = __importDefault(require("./routes/error-handler.route"));
const feedbacks_route_1 = __importDefault(require("./routes/feedbacks.route"));
const home_route_1 = __importDefault(require("./routes/home.route"));
const not_found_route_1 = __importDefault(require("./routes/not-found.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const file_upload_service_1 = __importDefault(require("./services/file-upload.service"));
const database_util_1 = __importDefault(require("./utils/database.util"));
// const MongoDBStore = require("express-mongodb-session")(session);
// const store = new MongoDBStore({
//   uri: process.env.DATABASE_CONNECTION_URL,
//   collection: "sessions",
// });
// store.on("error", function (error) {
//   console.error(error);
// });
//* Default Configurations
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use(express_1.default.json());
//* Surfing Static Files
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "images")));
//* CORS
const ORIGINS = [config_1.default.frontendUrl, "*"];
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
// Sessions
// app.use(
//   require("express-session")({
//     secret: process.env.SESSION_SECRET_KEY,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//     },
//     store: store,
//     resave: true,
//     saveUninitialized: true,
//   })
// );
app.use(file_upload_service_1.default);
//* Original Routes
app.use("/", home_route_1.default);
app.use("/auth", auth_route_1.default);
app.use("/admin", admin_route_1.default);
app.use("/user", users_route_1.default);
app.use("/feedbacks", feedbacks_route_1.default);
app.use("/", comments_route_1.default);
app.use(not_found_route_1.default);
app.use(error_handler_route_1.default);
//* Server Running
const PORT = 9000;
(0, database_util_1.default)().then(() => {
    console.info("database connection established...");
    app.listen(PORT, () => console.info(`listening on port: ${PORT}...`));
});
