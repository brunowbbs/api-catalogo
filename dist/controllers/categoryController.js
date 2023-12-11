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
exports.categoryControllerDelete = exports.categoryControllerPut = exports.categoryControllerGetAll = exports.categoryControllerPost = void 0;
const categorymodel_1 = __importDefault(require("../models/categorymodel"));
const categoryControllerPost = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    try {
        const category = yield categorymodel_1.default.create(body);
        return response.status(201).json(category);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.categoryControllerPost = categoryControllerPost;
const categoryControllerGetAll = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categorymodel_1.default.find();
        return response.status(200).json(category);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.categoryControllerGetAll = categoryControllerGetAll;
const categoryControllerPut = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const idCategory = request.params.id;
    try {
        const category = yield categorymodel_1.default.findById(idCategory);
        if (!category) {
            return response.status(404).json("Categoria nao existe");
        }
        yield categorymodel_1.default.findByIdAndUpdate(idCategory, body);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.categoryControllerPut = categoryControllerPut;
const categoryControllerDelete = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const idCategory = request.params.id;
    try {
        const category = yield categorymodel_1.default.findById(idCategory);
        if (!category) {
            return response.status(404).json("Categoria nao existe");
        }
        yield categorymodel_1.default.findByIdAndDelete(idCategory);
        return response.status(204).json();
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
exports.categoryControllerDelete = categoryControllerDelete;
