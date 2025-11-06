import { pool } from "../config/db.js";

export const createSaleTransaction = async (clienteId, items, metodoPago, creadoPor) => {
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
            const [rows] = await connection.query("SELECT id, precio_venta, stock FROM productos WHERE id = ? FOR UPDATE", [prodId]);
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
            [clienteId, total.toFixed(2), metodoPago, creadoPor]
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
export const getAllSales = async () => {
    const [rows] = await pool.query(
        `SELECT v.id, v.cliente_id, u.name AS cliente_nombre, v.total, v.metodo_pago, v.creado_por, v.fecha, c.name as creado_por_nombre
        FROM ventas v 
        LEFT JOIN users u ON v.cliente_id = u.id
        LEFT JOIN users c ON v.creado_por = c.id
        ORDER BY v.fecha DESC`
    );
    return rows;
};
// Obtener ventas de un cliente especifico
export const getSalesByClient = async (clienteId) => {
    const [rows] = await pool.query(
        `SELECT v.id, v.cliente_id, v.total, v.metodo_pago, v.creado_por, v.fecha
        FROM ventas v
        where v.cliente_id = ?
        ORDER BY v.fecha DESC`,
        [clienteId]
    );
    return rows;
};
// Obtener detalle de una venta
// Objeto con el que se obtiene la cabecera de la venta ejemplo: venta total, cliente, fecha, etc
export const getSaleByIdModel = async (ventaId) => {
    const [rows] = await pool.query(
        `SELECT v.id, v.cliente_id, u.name AS cliente_nombre, v.total, v.metodo_pago, v.creado_por, v.fecha, v.metodo_pago, c.name as creado_por_nombre
        FROM ventas v 
        LEFT JOIN users u ON v.cliente_id = u.id
        LEFT JOIN users c ON v.creado_por = c.id
        where v.id = ?`,
        [ventaId]
    );
    const venta = rows[0];
    // Objeto con el que se obtiene el detalle de la venta ejemplo: productos, cantidades, precios, etc
    if (!venta) return null;
    const [detalle] = await pool.query(
        `SELECT dv.id, dv.producto_id, p.producto AS producto_nombre, dv.cantidad, dv.precio_unitario, dv.subtotal
        FROM detalle_ventas dv
        JOIN productos p ON dv.producto_id = p.id
        WHERE dv.venta_id = ?`,
        [ventaId]
    );
    return { ...venta, detalle };
};