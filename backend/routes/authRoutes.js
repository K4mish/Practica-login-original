import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();
//Ruta post/api/register -> registrar usuario
router.post("/register", register);
//Ruta post/api/login -> iniciar sesion
router.post("/login", login);

export default router;