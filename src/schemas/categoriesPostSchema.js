import joi from "joi";

const bodySchema = joi.object({
    name: joi.string().trim().empty(""),
});

export default bodySchema;