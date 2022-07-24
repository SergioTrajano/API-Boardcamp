import joi from "joi";

const bodySchema = joi.object({
    name: joi.string().trim().empty(""),
    phone: joi.string().empty("").trim(),
    cpf: joi.string().empty("").trim(),
    birthday: joi.string(),
});

export default bodySchema;