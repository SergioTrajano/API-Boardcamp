import { bodySchema } from "../schemas/rentalsSchemas.js";
import connection from "../database.js";

export async function validateBody(req, res, next) {
    const newRentalInfo = req.body;

    const { error } = bodySchema.validate(newRentalInfo);

    if (error) {
        res.sendStatus(422);
        return;
    }

    const { rows: dbGames } = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`, [newRentalInfo.gameId]);
    const { rows: dbCustomers } = await connection.query(`SELECT id FROM customers WHERE id=$1`, [newRentalInfo.customerId]);

    if (!dbCustomers.length || !dbGames.length || newRentalInfo.daysRented <= 0) {
        res.sendStatus(400);
        return;
    }

    res.locals.pricePerDay = dbGames[0].pricePerDay;

    next();
}

export async function validateIdPost(req, res, next) {
    const { id } = req.params;

    const { rows: rental } = await connection.query(`SELECT rentals.id, rentals."returnDate", rentals."rentDate", rentals."daysRented", games."pricePerDay" FROM rentals JOIN games ON rentals."gameId"=games.id WHERE rentals.id=$1`, [id]);

    if (!rental.length) {
        res.sendStatus(404);
        return;
    }
    if (rental[0].returnDate) {
        res.sendStatus(400);
        return;
    }

    res.locals.rentDate = rental[0].rentDate;
    res.locals.price = rental[0].pricePerDay;
    res.locals.daysRented = rental[0].daysRented;

    next();
}

export async function validateIdDelete(req, res, next) {
    const { id } = req.params;

    const { rows: rental } = await connection.query(`SELECT "returnDate" FROM rentals WHERE rentals.id=$1`, [id]);

    if (!rental.length) {
        res.sendStatus(404);
        return;
    }
    if (!rental[0].returnDate) {
        res.sendStatus(400);
        return;
    }

    next();
}