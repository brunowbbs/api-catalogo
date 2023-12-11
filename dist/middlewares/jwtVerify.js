"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtVerify = (request, response, next) => {
    const token = request.headers?.authorization || "";
    if (!token) {
        return response.status(401).json({ message: "Usuario nao autorizado" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        next();
    }
    catch (error) {
        return response.status(401).json({ message: "Usuario nao autorizado" });
    }
};
exports.jwtVerify = jwtVerify;
