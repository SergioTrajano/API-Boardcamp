import connection from "../database.js";
import dayjs from "dayjs";

export async function insertCostumer(req, res) {
    const newCustomer = req.body;

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function listCostumers(req, res) {
    const searchCpf = req.query.cpf;
    const { offset, limit } = req.query;
    const querySupplieParams = [];
    let queryComplement = ``;

    if (searchCpf) {
        querySupplieParams.push(searchCpf);
        queryComplement += `WHERE cpf LIKE $${querySupplieParams.length} `;
    }
    if (offset && Number(offset)) {
        querySupplieParams.push(offset);
        queryComplement += `OFFSET $${querySupplieParams.length} `;
    }
    if (limit && Number(limit)) {
        querySupplieParams.push(limit);
        queryComplement += `LIMIT $${querySupplieParams.length} `;
    }

    const { rows: customers } = await connection.query(`
    SELECT customers.*, (SELECT COUNT(*) FROM rentals WHERE rentals."customerId"=customers.id)
    as "rentalsCount"
    FROM customers
    ${queryComplement}`, querySupplieParams);

    customers.forEach(c => c.birthday = dayjs(c.birthday).format("YYYY-MM-DD"));

    res.send(customers);
}

export async function identifyCustomerById(req, res) {
    const  idCustomer = req.params.id;

    const {rows: customer } = await connection.query(`SELECT * FROM customers WHERE id=$1`, [idCustomer]);
    customer.map(c => c.birthday = dayjs(c.birthday).format("YYYY-MM-DD"));

    res.send(customer[0]);
}

export async function updateCustomers(req, res) {
    const customerId = req.params.id;
    const customerInfo = req.body;

    try {
        await connection.query(`UPDATE customers SET (name, phone, cpf, birthday)=($1, $2, $3, $4) WHERE id=$5`, [customerInfo.name, customerInfo.phone, customerInfo.cpf, customerInfo.birthday, customerId]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}