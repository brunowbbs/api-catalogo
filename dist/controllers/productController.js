"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productControllerGetByCategory = exports.productControllerGetRecents = exports.productControllerUpdate = exports.productControllerDelete = exports.productControllerGetById = exports.productControllerGetAll = exports.productControllerPost = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const storage_1 = require("firebase/storage");
const productControllerPost = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const storage = (0, storage_1.getStorage)();
    const body = request.body;
    const token = (_a = request.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!token) {
        return response.status(401).json({ message: "Usuario nao tem permissao" });
    }
    if (!((_b = request.file) === null || _b === void 0 ? void 0 : _b.buffer)) {
        return response.status(400).json({ message: "Envie uma imagem válida" });
    }
    try {
        const storageRef = (0, storage_1.ref)(storage, `files/${(_c = request.file) === null || _c === void 0 ? void 0 : _c.originalname}${Date.now()}`);
        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, (_d = request.file) === null || _d === void 0 ? void 0 : _d.buffer, { contentType: (_e = request.file) === null || _e === void 0 ? void 0 : _e.mimetype });
        const downloadUrl = yield (0, storage_1.getDownloadURL)(snapshot.ref);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        body.usuario = decoded.id;
        body.imagem = downloadUrl;
        const product = yield productModel_1.default.create(body);
        return response.status(201).json(product);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.productControllerPost = productControllerPost;
const productControllerGetAll = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const nomeProduto = (_f = request.query) === null || _f === void 0 ? void 0 : _f.nomeProduto;
    try {
        const products = yield productModel_1.default.find({
            nome: { $regex: new RegExp(nomeProduto, "i") },
        });
        return response.status(200).json(products);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.productControllerGetAll = productControllerGetAll;
const productControllerGetById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = request.params.id;
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            return response.status(404).json({ message: "Produto nao encontrado" });
        }
        return response.status(200).json(product);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.productControllerGetById = productControllerGetById;
const productControllerDelete = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const productId = request.params.id;
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            return response.status(404).json({ message: "Produto nao encontrado" });
        }
        const token = (_g = request.headers) === null || _g === void 0 ? void 0 : _g.authorization;
        if (!token) {
            return response
                .status(401)
                .json({ message: "Usuario nao tem permissao" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        const isUserValid = product.usuario.toString() === String(decoded.id);
        if (!isUserValid) {
            return response
                .status(401)
                .json({ message: "Usuario nao tem permissao" });
        }
        yield productModel_1.default.findByIdAndDelete(productId);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.productControllerDelete = productControllerDelete;
const productControllerUpdate = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l, _m;
    const body = request.body;
    try {
        const productId = request.params.id;
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            return response.status(404).json({ message: "Produto nao encontrado" });
        }
        const token = (_h = request.headers) === null || _h === void 0 ? void 0 : _h.authorization;
        if (!token) {
            return response
                .status(401)
                .json({ message: "Usuario nao tem permissao" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        const isUserValid = product.usuario.toString() === String(decoded.id);
        if (!isUserValid) {
            return response
                .status(401)
                .json({ message: "Usuario nao tem permissao" });
        }
        if (!request.file) {
            yield productModel_1.default.findByIdAndUpdate(productId, body);
            return response.status(204).json();
        }
        if (!((_j = request.file) === null || _j === void 0 ? void 0 : _j.buffer)) {
            return response.status(400).json({ message: "Envie uma imagem válida" });
        }
        const storage = (0, storage_1.getStorage)();
        const storageRef = (0, storage_1.ref)(storage, `files/${(_k = request.file) === null || _k === void 0 ? void 0 : _k.originalname}${Date.now()}`);
        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, (_l = request.file) === null || _l === void 0 ? void 0 : _l.buffer, { contentType: (_m = request.file) === null || _m === void 0 ? void 0 : _m.mimetype });
        const downloadUrl = yield (0, storage_1.getDownloadURL)(snapshot.ref);
        body.imagem = downloadUrl;
        yield productModel_1.default.findByIdAndUpdate(productId, body);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.productControllerUpdate = productControllerUpdate;
const productControllerGetRecents = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find().sort({ createdAt: 1 }).limit(10);
        return response.status(200).json(products);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.productControllerGetRecents = productControllerGetRecents;
const productControllerGetByCategory = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const categoria = request.params.categoria;
    try {
        const products = yield productModel_1.default.find({ category: categoria });
        return response.status(200).json(products);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.productControllerGetByCategory = productControllerGetByCategory;
