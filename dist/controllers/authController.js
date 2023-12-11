"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.registerController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const registerController = async (request, response) => {
    try {
        const body = request.body;
        const userExists = await userModel_1.default.findOne({ email: body.email });
        if (userExists) {
            return response.status(400).json({ message: "Email ja cadastrado" });
        }
        body.senha = bcryptjs_1.default.hashSync(body.senha, 5);
        await userModel_1.default.create(body);
        return response.json({
            message: `${body.nome} foi cadastrado com sucesso`,
        });
    }
    catch (error) {
        return response.status(500).json({ error });
    }
};
exports.registerController = registerController;
const authController = async (request, response) => {
    //EMAIL e SENHA
    const body = request.body;
    try {
        const usuario = await userModel_1.default.findOne({ email: body.email });
        if (!usuario) {
            return response.status(404).json({ message: "Usuario nao existe" });
        }
        const resultadoComparacaoSenha = bcryptjs_1.default.compareSync(body.senha, usuario.senha);
        if (!resultadoComparacaoSenha) {
            return response
                .status(400)
                .json({ message: "Senha e/ou email invalidos" });
        }
        const token = jsonwebtoken_1.default.sign({ id: usuario._id }, process.env.SECRET_KEY || "");
        return response.json({
            email: usuario.email,
            nome: usuario.nome,
            token: token,
        });
    }
    catch (error) {
        return response.status(500).json(error);
    }
};
exports.authController = authController;
