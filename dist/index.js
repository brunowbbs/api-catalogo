"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const app_1 = require("firebase/app");
const firebase_1 = __importDefault(require("./config/firebase"));
const authController_1 = require("./controllers/authController");
const categoryController_1 = require("./controllers/categoryController");
const jwtVerify_1 = require("./middlewares/jwtVerify");
const productController_1 = require("./controllers/productController");
// import { testController } from "./controllers/testController";
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
(0, app_1.initializeApp)(firebase_1.default.firebaseConfig);
mongoose_1.default.connect(process.env.STRING_BANCO_DADOS ? process.env.STRING_BANCO_DADOS : "");
app.get("/ping", (request, response) => {
    return response.json({ message: "Pong" });
});
//USUARIOS
app.post("/registro", authController_1.registerController);
app.post("/auth", authController_1.authController);
//CATEGORIAS
app.post("/categorias", jwtVerify_1.jwtVerify, categoryController_1.categoryControllerPost);
app.get("/categorias", jwtVerify_1.jwtVerify, categoryController_1.categoryControllerGetAll);
app.put("/categorias/:id", jwtVerify_1.jwtVerify, categoryController_1.categoryControllerPut);
app.delete("/categorias/:id", jwtVerify_1.jwtVerify, categoryController_1.categoryControllerDelete);
//PRODUTOS
app.post("/produtos", jwtVerify_1.jwtVerify, upload.single("filename"), productController_1.productControllerPost);
app.get("/produtos", jwtVerify_1.jwtVerify, productController_1.productControllerGetAll);
app.get("/produtos/:id", jwtVerify_1.jwtVerify, productController_1.productControllerGetById);
app.delete("/produtos/:id", jwtVerify_1.jwtVerify, productController_1.productControllerDelete);
app.put("/produtos/:id", jwtVerify_1.jwtVerify, upload.single("filename"), productController_1.productControllerUpdate);
app.get("/produtos-recentes", jwtVerify_1.jwtVerify, productController_1.productControllerGetRecents);
app.get("/produtos-por-categoria/:categoria", jwtVerify_1.jwtVerify, productController_1.productControllerGetByCategory);
app.listen(process.env.PORT, () => console.log("Servidor iniciado com sucesso"));
