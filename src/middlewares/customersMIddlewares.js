import connection from "../database.js";
import dayjs from "dayjs";

import bodySchema from "../schemas/customersSchema.js";

function badRequestMistakes(newCustomer) {
    const validateCPF = /[0-9]{11}/;
    const validatePhone = /[0-9]{10,11}/;
    const costumersBirthdayYear = parseInt(dayjs(newCustomer.birthday).format("YYYY"));
    const currentYear = parseInt(dayjs().format("YYYY"))
    const maxValidAge = 100;
    const info = [];

    if (!newCustomer.name) info.push("'name' não pode ser uma string vazia");
    if (!validateCPF.test(newCustomer.cpf)) info.push("'cpf' deve ser uma string com 11 caracteres numéricos");
    if (!validatePhone.test(newCustomer.phone)) info.push("'phone' deve ser uma string com 10 ou 11 caracteres numéricos");

    return info;
}

export async function validateBody(req, res, next) {
    const newCustomer = req.body;

    const { error } = bodySchema.validate(newCustomer);

    if (error) {
        res.sendStatus(422);
        return;
    }

    const badRequestInfo = badRequestMistakes(newCustomer);
    if (badRequestInfo.length) {
        res.status(400).send(badRequestInfo);
        return;
    }

    const { rows: dbCPF } = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [newCustomer.cpf]);
    if (dbCPF.length) {
        res.status(409).send("'cpf' não pode ser de um cliente já existente");
        return;
    }
    
    next();
}

export async function validateIdParam(req, res, next) {
    const customerId = req.params.id;

    const { rows: dbCustomers } = await connection.query(`SELECT id FROM customers WHERE id=$1`, [customerId]);
    if (!dbCustomers.length) {
        res.sendStatus(404);
        return;
    }

    next();
}

export async function verifyCPF(req, res, next) {
    const newCustomer = req.body;
    const customerId = req.params.id;

    const { error } = bodySchema.validate(newCustomer);

    if (error) {
        res.sendStatus(422);
        return;
    }

    const badRequestInfo = badRequestMistakes(newCustomer);
    if (badRequestInfo.length) {
        res.status(400).send(badRequestInfo);
        return;
    }

    const { rows: dbCPF } = await connection.query(`SELECT * FROM customers WHERE cpf=$1 AND id<>$2`, [newCustomer.cpf, customerId]);
    if (dbCPF.length) {
        res.status(409).send("'cpf' não pode ser de um cliente já existente");
        return;
    }
    
    next();
}