import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) return res.status(401).json({message: "Token requerido"});
    jwt.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        if (err) return res.status(403).json({message: "Token invalido"});
        req.user = decoded;
        next();
    });
};
export const isAdmin = (req, res, next) => {
    if (!req.user) { return res.status(401).json({message: "Usuario no autenticado"}); } // Verifica que el usuario esté autenticado
    if (req.user.rol !== 'admin') {
        return res.status(403).json({message: "Acceso denegado se requiere rol de administrador"}); // Verifica que el usuario tenga rol de administrador
    }
    next();
};