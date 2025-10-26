import express from "express";
import { getProducts, getProductById, addProduct, editProduct, removeProduct } from "../controllers/productController.js";

const router = express.Router();
// Ruta para obtener todos los productos
router.get("/products", getProducts);
// Ruta para obtener un producto por id
router.get("/products/:id", getProductById);
// Ruta para crear un nuevo producto
router.post("/products", addProduct);
// Ruta para actualizar un producto existente
router.put("/products/:id", editProduct);
// Ruta para eliminar un producto
router.delete("/products/:id", removeProduct);

export default router;