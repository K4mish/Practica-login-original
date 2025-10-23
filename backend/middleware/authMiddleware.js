import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
export const verifyToken = (req, res, next) => {
    const token = req.headers['autorization']?.split(" ")[1];
    if (!token) return res.status(401).json({message: "Token requerido"});
    jwt.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        if (err) return res.status(403).json({message: "Token invalido"});
        req.user = decoded;
        next();
    });
};