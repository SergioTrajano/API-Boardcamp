import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import categoriesRoute from "./Routes/categoriesRoute.js";
import customersRoute from "./Routes/customersRoute.js";
import gamesRoute from "./Routes/gamesRoute.js";
import rentalsRoute from "./Routes/rentalsRoute.js";

dotenv.config();

const server = express();

server.use(express.json());
server.use(cors());

// Rotas
server.use(categoriesRoute);
server.use(customersRoute);
server.use(gamesRoute);
server.use(rentalsRoute);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});