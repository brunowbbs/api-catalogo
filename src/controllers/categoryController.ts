import { Request, Response } from "express";

import Categorymodel from "../models/categorymodel";

type CategoryBody = {
  nome: string;
};

export const categoryControllerPost = async (
  request: Request,
  response: Response
) => {
  const body: CategoryBody = request.body;

  try {
    const category = await Categorymodel.create(body);

    return response.status(201).json(category);
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const categoryControllerGetAll = async (
  request: Request,
  response: Response
) => {
  try {
    const category = await Categorymodel.find();

    return response.status(200).json(category);
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const categoryControllerPut = async (
  request: Request,
  response: Response
) => {
  const body: CategoryBody = request.body;
  const idCategory = request.params.id;

  try {
    const category = await Categorymodel.findById(idCategory);

    if (!category) {
      return response.status(404).json("Categoria nao existe");
    }

    await Categorymodel.findByIdAndUpdate(idCategory, body);

    return response.status(204).json();
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const categoryControllerDelete = async (
  request: Request,
  response: Response
) => {
  const idCategory = request.params.id;

  try {
    const category = await Categorymodel.findById(idCategory);

    if (!category) {
      return response.status(404).json("Categoria nao existe");
    }

    await Categorymodel.findByIdAndDelete(idCategory);

    return response.status(204).json();
  } catch (error) {
    return response.status(500).json(error);
  }
};
