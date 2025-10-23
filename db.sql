CREATE DATABASE IF NOT EXISTS miapp;

use miapp;

CREATE TABLE users (
    id int auto_increment primary key,
    name varchar(100),
    email varchar(100) unique,
    password varchar(255),
    rol enum('admin', 'cliente') default 'cliente'
);