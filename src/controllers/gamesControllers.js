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
    const querySupplieParams = [];
    let queryComplement = ``;

    if (searchNameInitial) {
        querySupplieParams.push(searchNameInitial);
        queryComplement += `WHERE LOWER(games.name) LIKE  Lower($${querySupplieParams.length}) || '%'`;
    }
    if (offset && Number(offset)) {
        querySupplieParams.push(offset);
        queryComplement += `OFFSET $${querySupplieParams.length} `;
    }
    if (limit && Number(limit)) {
        querySupplieParams.push(limit);
        queryComplement += `LIMIT $${querySupplieParams.length} `;
    }

    const { rows: games } = await connection.query(`SELECT games.*, categories.name as "categoryName", 
    (SELECT COUNT(*) FROM rentals WHERE rentals."gameId"=games.id) as "rentalsCount"  
    FROM games 
    JOIN categories 
    ON games."categoryId" = categories.id
    ${queryComplement}
    
    `, querySupplieParams);

    res.send(games);
}