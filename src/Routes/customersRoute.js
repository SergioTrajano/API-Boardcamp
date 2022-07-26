import { Router } from "express";

import { validateBody, validateIdParam, verifyCPF } from "../middlewares/customersMIddlewares.js";
import { insertCostumer, listCostumers, identifyCustomerById, updateCustomers } from "../controllers/customersControllers.js";

const router = Router();

router.get("/customers", listCostumers);
router.get("/customers/:id", validateIdParam, identifyCustomerById);
router.post("/customers", validateBody, insertCostumer);
router.put("/customers/:id", validateIdParam, verifyCPF, updateCustomers);

export default router;