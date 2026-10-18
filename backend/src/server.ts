import express from "express";
import usuariosRouter from "./routes/usuarios";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(usuariosRouter);

app.listen(3000, () => console.log("Zenith API rodando na porta 3000"));