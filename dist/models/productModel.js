"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    nome: {
        type: String,
        required: true,
    },
    preco: {
        type: Number,
        required: true,
    },
    imagem: {
        type: String,
        required: true,
    },
    estoque: {
        type: Number,
        required: true,
    },
    representante: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Categoria",
        required: true,
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Produto", productSchema);
