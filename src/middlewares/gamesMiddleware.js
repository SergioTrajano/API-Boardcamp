import connection from "../database.js";
import { bodySchema } from "../schemas/gamesSchema.js";

export default async function validateBody(req, res, next) {
    const newGame = req.body;

    try {
        const {rows: dbCategories } = await connection.query("SELECT id FROM categories");
        const { rows: dbGames } = await connection.query("SELECT name FROM games");
        
        const { error } = bodySchema.validate(newGame);

        if (error) {
            res.sendStatus(422);
            return;
        }

        const err = [];
        if (!newGame.name) err.push("'name' não pode estar vazio");
        if (newGame.stockTotal <= 0) err.push("'stockTotal' deve se maior que 0");
        if (newGame.pricePerDay <= 0) err.push("'pricePerDay' deve se maior que 0");
        if (!dbCategories.some(c => c.id === newGame.categoryId)) err.push("'categoryId' deve ser um id de categoria existente");

        if (err.length) {
            res.status(400).send(err);
            return;
        }
        if (dbGames.some(c => c.name === newGame.name)) {
            res.status(409).send("'name' não pode ser um nome de jogo já existente");
            return;
        }

        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    
}