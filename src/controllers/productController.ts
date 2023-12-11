import { Request, Response } from "express";
import ProductModel from "../models/productModel";
import jwt from "jsonwebtoken";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

type BodyPost = {
  nome: string;
  preco: number;
  imagem: string;
  estoque: number;
  representante: string;
  descricao: string;
  category: string;
  usuario: number;
};

type DecodedType = {
  id: number;
};

export const productControllerPost = async (
  request: Request,
  response: Response
) => {
  const storage = getStorage();

  const body: BodyPost = request.body;

  const token = request.headers?.authorization;

  if (!token) {
    return response.status(401).json({ message: "Usuario nao tem permissao" });
  }

  if (!request.file?.buffer) {
    return response.status(400).json({ message: "Envie uma imagem válida" });
  }

  try {
    const storageRef = ref(
      storage,
      `files/${request.file?.originalname}${Date.now()}`
    );

    const snapshot = await uploadBytesResumable(
      storageRef,
      request.file?.buffer,
      { contentType: request.file?.mimetype }
    );

    const downloadUrl = await getDownloadURL(snapshot.ref);

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || ""
    ) as DecodedType;

    body.usuario = decoded.id;
    body.imagem = downloadUrl;

    const product = await ProductModel.create(body);
    return response.status(201).json(product);
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const productControllerGetAll = async (
  request: Request,
  response: Response
) => {
  const nomeProduto = request.query?.nomeProduto as string;

  try {
    const products = await ProductModel.find({
      nome: { $regex: new RegExp(nomeProduto, "i") },
    });

    return response.status(200).json(products);
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const productControllerGetById = async (
  request: Request,
  response: Response
) => {
  try {
    const productId = request.params.id;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({ message: "Produto nao encontrado" });
    }

    return response.status(200).json(product);
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const productControllerDelete = async (
  request: Request,
  response: Response
) => {
  try {
    const productId = request.params.id;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({ message: "Produto nao encontrado" });
    }

    const token = request.headers?.authorization;

    if (!token) {
      return response
        .status(401)
        .json({ message: "Usuario nao tem permissao" });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || ""
    ) as DecodedType;

    const isUserValid = product.usuario.toString() === String(decoded.id);

    if (!isUserValid) {
      return response
        .status(401)
        .json({ message: "Usuario nao tem permissao" });
    }

    await ProductModel.findByIdAndDelete(productId);

    return response.status(204).json();
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const productControllerUpdate = async (
  request: Request,
  response: Response
) => {
  const body: BodyPost = request.body;

  try {
    const productId = request.params.id;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return response.status(404).json({ message: "Produto nao encontrado" });
    }

    const token = request.headers?.authorization;

    if (!token) {
      return response
        .status(401)
        .json({ message: "Usuario nao tem permissao" });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || ""
    ) as DecodedType;

    const isUserValid = product.usuario.toString() === String(decoded.id);

    if (!isUserValid) {
      return response
        .status(401)
        .json({ message: "Usuario nao tem permissao" });
    }

    if (!request.file) {
      await ProductModel.findByIdAndUpdate(productId, body);
      return response.status(204).json();
    }

    if (!request.file?.buffer) {
      return response.status(400).json({ message: "Envie uma imagem válida" });
    }

    const storage = getStorage();
    const storageRef = ref(
      storage,
      `files/${request.file?.originalname}${Date.now()}`
    );

    const snapshot = await uploadBytesResumable(
      storageRef,
      request.file?.buffer,
      { contentType: request.file?.mimetype }
    );

    const downloadUrl = await getDownloadURL(snapshot.ref);

    body.imagem = downloadUrl;

    await ProductModel.findByIdAndUpdate(productId, body);

    return response.status(204).json();
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const productControllerGetRecents = async (
  request: Request,
  response: Response
) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: 1 }).limit(10);

    return response.status(200).json(products);
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const productControllerGetByCategory = async (
  request: Request,
  response: Response
) => {
  const categoria = request.params.categoria;

  try {
    const products = await ProductModel.find({ category: categoria });
    return response.status(200).json(products);
  } catch (error) {
    return response.status(500).json(error);
  }
};
