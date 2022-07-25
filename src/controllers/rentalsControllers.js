import dayjs from "dayjs";

import connection from "../database.js";

export async function insertRental(req, res) {
    const newRentalInfo = req.body;
    const { pricePerDay } = res.locals;
    const newRental = [
        newRentalInfo.customerId, 
        newRentalInfo.gameId, 
        dayjs().format("YYYY-MM-DD"), 
        newRentalInfo.daysRented, 
        null, 
        pricePerDay * newRentalInfo.daysRented, 
        null,
    ];

    try {
        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`, newRental);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

function rentalModal(getRentals) {
    const rentals = [];

    for (let rental of getRentals) {
        const formatReturnDate = rental.returnDate ? dayjs(rental.returnDate).format("YYYY-MM-DD") : null;
        rental = {
            ...rental,
            rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
            returnDate: formatReturnDate,
            customer: {
                id: rental.cId,
                name: rental.cName,
            },
            game: {
                id: rental.gId,
                name: rental.gName,
                categoryId: rental.caId,
                categoryName: rental.caName,
            },
        };
        delete rental.cId;
        delete rental.cName;
        delete rental.gId;
        delete rental.gName;
        delete rental.caId;
        delete rental.caName;
        rentals.push(rental);
    }

    return rentals;
}

export async function listRentals(req, res) {
    const customerId = parseInt(req.query.customerId);
    const gameId = parseInt(req.query.gameId);
    const { offset, limit, status, startDate } = req.query;
    
    const querySupplieParams = [];
    let queryComplement = ``;

    if (customerId) {
        querySupplieParams.push(customerId);
        queryComplement += `WHERE rentals."customerId"=$${querySupplieParams.length} `;
    }
    if (gameId) {
        const currentquerySupplieParamsLength = querySupplieParams.length;
        querySupplieParams.push(gameId);
        currentquerySupplieParamsLength > 0 ? queryComplement += `AND rentals."gameId"=$${querySupplieParams.length} ` : `WHERE rentals."gameId"=$${querySupplieParams.length} `; 
    }
    if (status) {
        const currentquerySupplieParamsLength = querySupplieParams.length;

        if (status === "open") {
            currentquerySupplieParamsLength.length ? queryComplement += `AND WHERE rentals."returnDate" IS NULL ` : queryComplement += `WHERE rentals."returnDate" IS NULL `; 
        }
        else if (status === "close") {
            currentquerySupplieParamsLength.length ? queryComplement += `AND WHERE rentals."returnDate" IS NOT NULL ` : queryComplement += `WHERE rentals."returnDate" IS NOT NULL `;
        }
    }
    if (offset && Number(offset)) {
        querySupplieParams.push(offset);
        queryComplement += `OFFSET $${querySupplieParams.length} `;
    }
    if (limit && Number(limit)) {
        querySupplieParams.push(limit);
        queryComplement += `LIMIT $${querySupplieParams.length} `;
    }
    
    let { rows: getRentals } = await connection.query(`
        SELECT rentals.*, games.id as "gId", games.name as "gName", categories.id as "caId", categories.name as "caName", customers.id as "cId", customers.name as "cName" 
        FROM rentals 
        JOIN customers ON rentals."customerId"=customers.id 
        JOIN games ON rentals."gameId"=games.id 
        JOIN categories ON games."categoryId"=categories.id
        ${queryComplement}
        
        `, querySupplieParams);

    if ( startDate && dayjs(startDate).format("YYYY-MM-DD") !== "Invalid Date") getRentals = getRentals.filter(rental => dayjs(rental.rentDate) >= dayjs(startDate));

    const rentals = rentalModal(getRentals);

    res.send(rentals);
}

export async function finishRental(req, res) {
    const { id } = req.params;
    const rentDate  = dayjs(res.locals.rentDate);
    const { price, daysRented } = res.locals;
    const currentDay = dayjs();

    const delayFee = currentDay.diff(rentDate, "day") - daysRented > 0 ? (currentDay.diff(rentDate, "day") - daysRented) * price : 0;

    try {
        await connection.query(`UPDATE rentals SET ("returnDate", "delayFee")=($1, $2) WHERE id=$3`, [currentDay,  delayFee, id]);

        res.sendStatus(200);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}