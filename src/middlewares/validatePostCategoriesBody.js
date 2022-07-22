import bodySchema from "../schemas/categoriesPostSchema.js";
import connection from "../database.js";

export async function validateBody(req, res, next) {
    const category = req.body;

    try {
        const { rows: dbCategories } = await connection.query("SELECT name FROM categories");

        const { error } = bodySchema.validate(category);
    
        if (error) {
            res.sendStatus(422);
            return;
        }
        if (!category.name) {
            res.status(400).send("'name' não pode estar vazio");
            return;
        }
        if (dbCategories.some( c => c.name === category.name)) {
            res.status(409).send("'name' não pode ser um nome de categoria já existente");
            return;
        }
    
        next();
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
}