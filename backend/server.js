import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();
//Obtener URL
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//middleware para habilitar cors
app.use(cors());
//middleware para leer los formatos JSON
app.use(express.json());
//Servir los archivos estaticos del frontend
app.use(express.static(path.join(__dirname, "../frontend")));

//rutas API
app.use("/api", authRoutes);
//Ruta raiz que muestra el html de inicio
app.get("/", (req, res) => {
    res.sendFile(path.join(__filename, "../../frontend/pages/index.html"));
});
//Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});