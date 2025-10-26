import { pool } from '../config/db.js';
// Crear nuevo producto
export const createProduct = async (producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra) => {
    const [result] = await pool.query(
        'INSERT INTO products (producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra]
    );
    return result.insertId; //Id del nuevo producto
};
// Buscar producto por id
export const findProductById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra FROM products WHERE id = ?',
        [id]
    );
    return rows[0]; //Devuelve un solo producto
};
// Listar todos los productos
export const getAllProduct = async() => {
    const [rows] = await pool.query('SELECT id, producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra FROM products');
    return rows;
};
// Eliminar producto
export const deleteProduct = async(id) => {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
};
// Editar producto
export const updateProduct = async(id, producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra) => {
    await pool.query(
        'UPDATE products SET producto = ?, descripcion = ?, precio_compra = ?, precio_venta = ?, stock = ?, imagen_url = ?, fecha_compra = ? WHERE id = ?',
        [producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra, id]
    );
};