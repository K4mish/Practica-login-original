import { Router } from "express";
import { createSale, createSaleByAdmin, getSaleById, getSales } from "../controllers/ventasController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Cliente crea una venta
router.post("/ventas", verifyToken, createSale);
// Admin crea una venta para un cliente
router.post("/ventas/admin", verifyToken, isAdmin, createSaleByAdmin);
// Obtener ventas
router.get("/ventas", verifyToken, getSales);
// Obtener detalle de una venta
router.get("/ventas/:id", verifyToken, isAdmin, getSaleById);

export default router;