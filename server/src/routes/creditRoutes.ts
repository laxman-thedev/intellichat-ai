import express from "express";
import {
    getPlans,
    purchasePlan,
} from "../controllers/creditController.js";
import { protect } from "../middlewares/auth.js";

/**
 * Router for credit & subscription related actions
 */
const creditRouter = express.Router();

/**
 * Fetch available credit plans
 * Public route – users can view plans without login
 */
creditRouter.get("/plan", getPlans);

/**
 * Purchase a credit plan via Stripe
 * Protected route – only authenticated users can purchase
 */
creditRouter.post("/purchase", protect, purchasePlan);

export default creditRouter;