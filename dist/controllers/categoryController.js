"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryControllerDelete = exports.categoryControllerPut = exports.categoryControllerGetAll = exports.categoryControllerPost = void 0;
const categorymodel_1 = __importDefault(require("../models/categorymodel"));
const categoryControllerPost = async (request, response) => {
    const body = request.body;
    try {
        const category = await categorymodel_1.default.create(body);
        return response.status(201).json(category);
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.categoryControllerPost = categoryControllerPost;
const categoryControllerGetAll = async (request, response) => {
    try {
        const category = await categorymodel_1.default.find();
        return response.status(200).json(category);
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.categoryControllerGetAll = categoryControllerGetAll;
const categoryControllerPut = async (request, response) => {
    const body = request.body;
    const idCategory = request.params.id;
    try {
        const category = await categorymodel_1.default.findById(idCategory);
        if (!category) {
            return response.status(404).json("Categoria nao existe");
        }
        await categorymodel_1.default.findByIdAndUpdate(idCategory, body);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.categoryControllerPut = categoryControllerPut;
const categoryControllerDelete = async (request, response) => {
    const idCategory = request.params.id;
    try {
        const category = await categorymodel_1.default.findById(idCategory);
        if (!category) {
            return response.status(404).json("Categoria nao existe");
        }
        await categorymodel_1.default.findByIdAndDelete(idCategory);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.categoryControllerDelete = categoryControllerDelete;
