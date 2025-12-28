import express from "express";
import { getPlans, purchasePlan } from "../controllers/creditController";
import { protect } from "../middlewares/auth";

const creditRouter = express.Router();

creditRouter.get("/plan", getPlans);
creditRouter.post("/purchase",protect, purchasePlan);

export default creditRouter;