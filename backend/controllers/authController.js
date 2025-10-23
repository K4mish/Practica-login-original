import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, getAllUsers, updateUser, deleteUser } from "../models/userModel.js";
dotenv.config();
// Listar usuarios
export async function getUsers(req, res) {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: "Error al obtener usuarios", error: error.message});
    }
};
// Controlador post register
export const register = async(req, res) => {
    const {name, email, password} = req.body;
    try {
        //Verificar si ya existe un usuario con ese email
        const user = await findUserByEmail(email);
        if(user) {
            return res.status(400).json({message: "El correo ya esta registrado"});
        }
        //Encriptacion de contraseña y creacion de nuevo usuario con rol cliente
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(name, email, hashedPassword);
        res.status(201).json({message: "Usuario registrado exitosamente", userId});
    } catch (error) {
        res.status(500).json({message: "Error al registrar usuario", error: error.message});
    }
};
// Controlador post login
export const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        // Buscar usuario por email
        const user = await findUserByEmail(email);
        if(!user) {
            return res.status(400).json({message: "Credenciales invalidas"});
        }
        // Hacemos comparacion de contraseñas
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return res.status(400).json({message: "Contraseña incorrecta"});
        }
        // Configurar token con info relevante
        const token = jwt.sign(
            {
                id: user.id,
                user: user.name,
                rol: user.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );
        // Devolver token y rol
        res.json({message: "Login exitoso", token, rol: user.rol});
    } catch {
        res.status(500).json({message: "Error al iniciar sesion", error: error.message});
    }
};
//Editar usuario
export async function editUser(req, res) {
    try {
        const {id} = req.params;
        const {name, email, rol} = req.body;
        await updateUser(id, name, email, rol);
        res.json({message: "Usuario actualizado exitosamente"});
    } catch (error) {
        res.status(500).json({message: "Error al actualizar usuario", error: error.message});
    }
};
//Eliminar usuario
export async function removeUser(req, res) {
    try {
        const {id} = req.params;
        await deleteUser(id);
        res.json({message: "Usuario eliminado exitosamente"});
    } catch (error) {
        res.status(500).json({message: "Error al eliminar usuario", error: error.message});
    }
};