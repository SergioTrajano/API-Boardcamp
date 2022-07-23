import connection from "../database.js";

export async function insertGame(req, res) {
    const newGame = req.body;

    try {
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listGames(req, res) {
    const searchNameInitial = req.query.name;
    const { offset, limit } = req.query;
    let games;

    if (searchNameInitial) {
        const {rows: list } = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE LOWER(games.name) LIKE Lower($1)`, [searchNameInitial + "%"]);
        games = list;
    }   else {
        const { rows: list } = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id`);
        games = list;
    }

    const initialIndex = offset ? parseInt(offset) : 0;
    const lastIndex = limit ? parseInt(limit) + initialIndex : games.length;

    res.send(games.splice(initialIndex, lastIndex));
}