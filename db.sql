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