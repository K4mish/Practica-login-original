CREATE DATABASE IF NOT EXISTS miapp;

use miapp;

CREATE TABLE users (
    id int auto_increment primary key,
    name varchar(100),
    email varchar(100) unique,
    password varchar(255),
    rol enum('admin', 'cliente') default 'cliente'
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    imagen_url TEXT,
    fecha_compra DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo','tarjeta','transferencia','otro') DEFAULT 'efectivo',
    creado_por INT NULL, -- id del usuario que registró la venta (admin o cliente)
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (creado_por) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla detalle_ventas (items)
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES products(id) ON DELETE RESTRICT
);