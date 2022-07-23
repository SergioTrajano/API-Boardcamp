import connection from "../database.js";

export async function listCategories(req, res) {
    const { offset, limit } = req.query;

    const { rows: categories } = await connection.query(`SELECT * FROM categories`);

    const initialIndex = offset ? parseInt(offset) : 0;
    const lastIndex = limit ? parseInt(limit) + initialIndex : categories.length;

    res.send(categories.slice(initialIndex, lastIndex));
}

export async function insertCategory(req, res) {
    const category = req.body.name;

    try {
        await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [category]);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}