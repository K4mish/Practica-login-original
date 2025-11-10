import { createSaleTransaction, getAllSales, getSaleByIdModel, getSalesByClient } from "../models/ventasModel.js";

// Cliente hace checkout
export const createSale = async (req, res) => {
    const clienteId = req.user.id;
    const { items, metodo_pago } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "El carrito de compras está vacío." });
    }

    try {
        const ventaId = await createSaleTransaction(clienteId, items, metodo_pago || "Efectivo", clienteId);
        res.status(201).json({ message: "Venta registrada.", ventaId });
    } catch (error) {
        res.status(400).json({ message: "Error al crear la venta", error: error.message });
    }
};
// Admin hace venta a nombre de un cliente
export const createSaleByAdmin = async (req, res) => {
    const creadoPor = req.user.id;
    const { cliente_id, items, metodo_pago } = req.body;
    if (!cliente_id) return res.status(400).json({ message: "Se requiere el ID del cliente." });
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "La venta necesita al menos un producto." });
    }

    try {
        const ventaId = await createSaleTransaction(cliente_id, items, metodo_pago || "Efectivo", creadoPor);
        res.status(201).json({ message: "Venta registrada por admin.", ventaId });
    } catch (error) {
        res.status(400).json({ message: "Error al crear la venta", error: error.message });
    }
};
// Respuestas de ventas con respecto al admin
export const getSales = async (req, res) => {
    try {
        if (req.user.rol === "admin") {
            const ventas = await getAllSales();
            return res.json(ventas);
        }
        const ventas = await getSalesByClient(req.user.id);
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las ventas", error: error.message });
    }
};
// Obtener una venta especifica
export const getSaleById = async (req, res) => {
    const ventaId = req.params.id;
    try {
        const venta = await getSaleByIdModel(ventaId);
        if (!venta) return res.status(404).json({ message: "Venta no encontrada." });
        // Verificar permisos
        if (req.user.rol !== "admin" && venta.cliente_id !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para ver esta venta." });
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la venta", error: error.message });
    }
};