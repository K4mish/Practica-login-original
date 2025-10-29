import express from "express";
import { getProducts, getProductById, addProduct, editProduct, removeProduct } from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ruta para obtener todos los productos
router.get("/products", getProducts);
// Ruta para obtener un producto por id
router.get("/products/:id", getProductById);

// Operaciones protegidas para administradores
// Ruta para crear un nuevo producto
router.post("/products", verifyToken, isAdmin, addProduct);
// Ruta para actualizar un producto existente
router.put("/products/:id", verifyToken, isAdmin, editProduct);
// Ruta para eliminar un producto
router.delete("/products/:id", verifyToken, isAdmin, removeProduct);

export default router;