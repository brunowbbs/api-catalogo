"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testController2 = exports.testController = void 0;
const testController = (request, response) => {
    return response.json({ message: "Tudo certo" });
};
exports.testController = testController;
const testController2 = (request, response) => {
    return response.json({ message: "Tudo certo" });
};
exports.testController2 = testController2;
exports.default = () => {
    console.log("ok");
};
