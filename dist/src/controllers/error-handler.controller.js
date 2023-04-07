"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, _, response, __) => {
    const message = error.message || "Sorry, an Error Occurred!";
    const status = error.statusCode || 500;
    const stack = process.env.NODE_ENV === "development" ? error.stack : {};
    const success = false;
    console.log(error); //* Log ERROR;
    response.status(status).json({
        success,
        status,
        message,
        stack,
    });
};
exports.default = errorHandler;
