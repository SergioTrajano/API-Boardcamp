import connection from "../database.js";

export async function listCategories(req, res) {
    const { offset, limit } = req.query;
    const querySupplieParams = [];
    let queryComplement = ``;

    if (offset && Number(offset)) {
        querySupplieParams.push(offset);
        queryComplement += `OFFSET $${querySupplieParams.length} `;
    }
    if (limit && Number(limit)) {
        querySupplieParams.push(limit);
        queryComplement += `LIMIT $${querySupplieParams.length} `;
    }

    const { rows: categories } = await connection.query(`
    SELECT * FROM categories 
    ${queryComplement}`, querySupplieParams);

    res.send(categories);
}

export async function insertCategory(req, res) {
    const category = req.body.name;

    try {
        await connection.query(`INSERT INTO categories (name) VALUES ($1) `, [category]);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}