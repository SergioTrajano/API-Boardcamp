import joi from "joi";

const bodySchema = joi.object({
    name: joi.string().trim().empty(""),
    phone: joi.string().empty("").trim(),
    cpf: joi.string().empty("").trim(),
    birthday: joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
});

export default bodySchema;