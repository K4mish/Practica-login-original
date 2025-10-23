import { pool } from "../config/db.js";
//Crear usuario nuevo
export const createUser = async(name, email, hashedPassword) => {
    const [result] = await pool.query(
        "insert into users (name, email, password, rol) values (?, ?, ?, ?)",
        [name, email, hashedPassword, "cliente"]
    );
    return result.insertId; //Deuelve id del nuevo usuario
};
//Buscar usuario por email para el login
export const findUserByEmail = async(email) => {
    const [rows] = await pool.query(
        "select id, name, email, password, rol from users where email = ?",
        [email]
    );
    return rows[0]; //Devuelva un solo usuario
};
//Listar usuarios en la tabla
export async function getAllUsers() {
    const [rows] = await pool.query("select id, name, email, rol from users");
    return rows;
};
//Eliminar usuario
export async function deleteUser(id) {
    await pool.query("delete from users where id = ?", [id]);
};
//Editar usuario
export async function updateUser(id, name, email, rol) {
    await pool.query("update users set name = ?, email = ?, rol = ? where id = ?", [name, email, rol, id]);
};