import { createProduct, findProductById, getAllProduct, deleteProduct, updateProduct } from "../models/productModel.js";
// Listar todos los productos
export async function getProducts(req, res) {
    try {
        const products = await getAllProduct();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los productos', error: error.message});
    }
};
// Buscar producto por id
export async function getProductById(req, res) {
    const { id } = req.params;
    try {
        const product = await findProductById(id);

        if (!product){
            return res.status(404).json({message: "Producto no encontrado"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message: 'Error al buscar el producto', error: error.message});
    }
};
// Crear nuevo producto
export async function addProduct(req, res) {
    const { producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra } = req.body;
    try {
        const productId =  await createProduct(producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra);
        res.status(201).json({message: "Producto creado exitosamente", productId});
    } catch (error) {
        res.status(500).json({message: "Error al crear el producto", error: error.message});
    }
};
// Editar producto
export async function editProduct(req, res) {
    const { id } = req.params;
    const { producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra } = req.body;
    try {
        const product = await updateProduct(id, producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra);
        res.json({message: "Producto actualizado exitosamente"});
    } catch (error) {
        res.status(500).json({message: "Error al actualizar el producto", error: error.message});
    }
};
// Eliminar producto
export async function removeProduct(req, res) {
    const { id } = req.params;
    try {
        await deleteProduct(id);
        res.json({message: "Producto eliminado exitosamente"});
    } catch (error) {
        res.status(500).json({message: "Error al eliminar el producto", error: error.message});
    }
};