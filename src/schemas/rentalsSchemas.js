import joi from "joi";

export const bodySchema = joi.object({
    customerId: joi.number().integer(),
    gameId: joi.number().integer(),
    daysRented: joi.number().integer(),
});