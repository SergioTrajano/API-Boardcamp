import joi from "joi";

export const bodySchema = joi.object({
    name: joi.string().empty(""),
    image: joi.string().required().pattern(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/),
    stockTotal: joi.number().integer(),
    categoryId: joi.number().integer(),
    pricePerDay: joi.number().integer(),
});