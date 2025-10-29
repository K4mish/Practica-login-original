import { pool } from "../config/db.js";

export const createSaleTransaction = async (cliemteId, items, metodoPago, creadoPor) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Validar calculo total
        let total = 0;
        const cache = new Map();
        for (const it of items) {
            const prodId = Number(it.productId);
            const cantidad = Number(it.cantidad);
            if(!prodId || !Number.isInteger(cantidad) || cantidad <= 0) {
                throw new Error("Datos de item invalidos");
            }
            // Bloqueamos fila mientras que la transaccion este activa con for update
            const [rows] = await connection.query("SELECT id, precio_venta, stock FROM productos WHERE id = ? FOR UPDATE", [produId]);
            if (rows.length === 0) {
                throw new Error(`Producto con id ${prodId} no encontrado`);
            }
            const p = rows[0];
            if (p.stock < cantidad) {
                throw new Error(`Stock insuficiente para el producto con id ${prodId}`);
            }
            cache.set(prodId, {precio_venta: Number(p.precio_venta), stock: p.stock});
            total += Number(p.precio_venta) * cantidad;
        }
        // Insertar venta
        const [ventaResult] = await connection.query(
            "INSERT INTO ventas (cliente_id, total, metodo_pago, creado_por) VALUES (?, ?, ?, ?)",
            [cliemteId, total.toFixed(2), metodoPago, creadoPor]
        );
        const ventaId = ventaResult.insertId;
        // Insertar detalle de venta y actualizar stock
        for (const it of items) {
            const prodId = Number(it.productId);
            const cantidad = Number(it.cantidad);
            const precio_unitario = cache.get(prodId).precio_venta;
            const subtotal = precio_unitario * cantidad;

            await connection.query(
                "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
                [ventaId, prodId, cantidad, precio_unitario.toFixed(2), subtotal.toFixed(2)]
            );
            await connection.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [cantidad, prodId]
            );
        }
        await connection.commit();
        return ventaId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
// Obtener resumen de ventas para el admin
export const getSales = async () => {
    const [rows] = await pool.query(
        `SELECT v.id, v.cliente_id, u.name AS cliente_nombre, v.total, v.metodo_pago, v.creado_por, v.fecha, c.name as creado_por_nombre
        FROM ventas v 
        LEFT JOIN users u ON v.cliente_id = u.id
        LEFT JOIN users c ON v.creado_por = c.id
        ORDER BY v.fecha DESC`
    );
    return rows;
}