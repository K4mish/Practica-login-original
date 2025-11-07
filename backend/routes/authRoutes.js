import express from "express";
import { login, register, getUsers, editUser, removeUser } from "../controllers/authController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
//Ruta post/api/register -> registrar usuario
router.post("/register", register);
//Ruta post/api/login -> iniciar sesion
router.post("/login", login);

//Ruta get/api/listar usuarios
router.get("/users", verifyToken, isAdmin, getUsers);
//Ruta put/api/editar usuario
router.put("/users/:id", verifyToken, isAdmin, editUser);
//Ruta delete/api/eliminar usuario
router.delete("/users/:id", verifyToken, isAdmin, removeUser);

export default router;