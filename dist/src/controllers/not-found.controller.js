"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (_, response) => {
    response.status(404).send("Sorry, this page does not exist!");
};
exports.default = notFound;
