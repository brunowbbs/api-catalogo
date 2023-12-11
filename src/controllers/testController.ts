import { Request, Response } from "express";

export const testController = (request: Request, response: Response) => {
  return response.json({ message: "Tudo certo" });
};

export const testController2 = (request: Request, response: Response) => {
  return response.json({ message: "Tudo certo" });
};

export default () => {
  console.log("ok");
};
