"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productControllerGetByCategory = exports.productControllerGetRecents = exports.productControllerUpdate = exports.productControllerDelete = exports.productControllerGetById = exports.productControllerGetAll = exports.productControllerPost = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const storage_1 = require("firebase/storage");
const productControllerPost = async (request, response) => {
    const storage = (0, storage_1.getStorage)();
    const body = request.body;
    const token = request.headers?.authorization;
    if (!token) {
        return response.status(401).json({ message: "Usuario nao tem permissao" });
    }
    if (!request.file?.buffer) {
        return response.status(400).json({ message: "Envie uma imagem válida" });
    }
    try {
        const storageRef = (0, storage_1.ref)(storage, `files/${request.file?.originalname}${Date.now()}`);
        const snapshot = await (0, storage_1.uploadBytesResumable)(storageRef, request.file?.buffer, { contentType: request.file?.mimetype });
        const downloadUrl = await (0, storage_1.getDownloadURL)(snapshot.ref);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
        body.usuario = decoded.id;
        body.imagem = downloadUrl;
        const product = await productModel_1.default.create(body);
        return response.status(201).json(product);
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.productControllerPost = productControllerPost;
const productControllerGetAll = async (request, response) => {
    const nomeProduto = request.query?.nomeProduto;
    try {
        const products = await productModel_1.default.find({
            nome: { $regex: new RegExp(nomeProduto, "i") },
        });
        return response.status(200).json(products);
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.productControllerGetAll = productControllerGetAll;
const productControllerGetById = async (request, response) => {
    try {
        const productId = request.params.id;
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            return response.status(404).json({ message: "Produto nao encontrado" });
        }
        return response.status(200).json(product);
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.productControllerGetById = productControllerGetById;
const productControllerDelete = async (request, response) => {
    try {
        const productId = request.params.id;
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            return response.status(404).json({ message: "Produto nao encontrado" });
        }
        const token = request.headers?.authorization;
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
        await productModel_1.default.findByIdAndDelete(productId);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.productControllerDelete = productControllerDelete;
const productControllerUpdate = async (request, response) => {
    const body = request.body;
    try {
        const productId = request.params.id;
        const product = await productModel_1.default.findById(productId);
        if (!product) {
            return response.status(404).json({ message: "Produto nao encontrado" });
        }
        const token = request.headers?.authorization;
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
            await productModel_1.default.findByIdAndUpdate(productId, body);
            return response.status(204).json();
        }
        if (!request.file?.buffer) {
            return response.status(400).json({ message: "Envie uma imagem válida" });
        }
        const storage = (0, storage_1.getStorage)();
        const storageRef = (0, storage_1.ref)(storage, `files/${request.file?.originalname}${Date.now()}`);
        const snapshot = await (0, storage_1.uploadBytesResumable)(storageRef, request.file?.buffer, { contentType: request.file?.mimetype });
        const downloadUrl = await (0, storage_1.getDownloadURL)(snapshot.ref);
        body.imagem = downloadUrl;
        await productModel_1.default.findByIdAndUpdate(productId, body);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.productControllerUpdate = productControllerUpdate;
const productControllerGetRecents = async (request, response) => {
    try {
        const products = await productModel_1.default.find().sort({ createdAt: 1 }).limit(10);
        return response.status(200).json(products);
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.productControllerGetRecents = productControllerGetRecents;
const productControllerGetByCategory = async (request, response) => {
    const categoria = request.params.categoria;
    try {
        const products = await productModel_1.default.find({ category: categoria });
        return response.status(200).json(products);
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.productControllerGetByCategory = productControllerGetByCategory;
