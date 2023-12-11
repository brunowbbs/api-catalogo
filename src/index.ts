import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";

import multer from "multer";

import { initializeApp } from "firebase/app";

import config from "./config/firebase";

import {
  authController,
  registerController,
} from "./controllers/authController";

import {
  categoryControllerDelete,
  categoryControllerGetAll,
  categoryControllerPost,
  categoryControllerPut,
} from "./controllers/categoryController";

import { jwtVerify } from "./middlewares/jwtVerify";
import {
  productControllerDelete,
  productControllerGetAll,
  productControllerGetByCategory,
  productControllerGetById,
  productControllerGetRecents,
  productControllerPost,
  productControllerUpdate,
} from "./controllers/productController";
// import { testController } from "./controllers/testController";

dotenv.config();

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

initializeApp(config.firebaseConfig);

mongoose.connect(
  process.env.STRING_BANCO_DADOS ? process.env.STRING_BANCO_DADOS : ""
);

app.get("/ping", (request, response) => {
  return response.json({ message: "Pong" });
});

//USUARIOS
app.post("/registro", registerController);
app.post("/auth", authController);

//CATEGORIAS
app.post("/categorias", jwtVerify, categoryControllerPost);
app.get("/categorias", jwtVerify, categoryControllerGetAll);
app.put("/categorias/:id", jwtVerify, categoryControllerPut);
app.delete("/categorias/:id", jwtVerify, categoryControllerDelete);

//PRODUTOS
app.post(
  "/produtos",
  jwtVerify,
  upload.single("filename"),
  productControllerPost
);

app.get("/produtos", jwtVerify, productControllerGetAll);
app.get("/produtos/:id", jwtVerify, productControllerGetById);
app.delete("/produtos/:id", jwtVerify, productControllerDelete);
app.put(
  "/produtos/:id",
  jwtVerify,
  upload.single("filename"),
  productControllerUpdate
);

app.get("/produtos-recentes", jwtVerify, productControllerGetRecents);
app.get(
  "/produtos-por-categoria/:categoria",
  jwtVerify,
  productControllerGetByCategory
);

app.listen(process.env.PORT, () =>
  console.log("Servidor iniciado com sucesso")
);
