import type { Request, Response } from "express";
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import type { AuthRequest } from "../middlewares/auth.js";

/* ------------------ PLANS ------------------ */

const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: [
            "100 text generations",
            "50 image generations",
            "Standard support",
            "Access to basic models",
        ],
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: [
            "500 text generations",
            "200 image generations",
            "Priority support",
            "Access to pro models",
            "Faster response time",
        ],
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: [
            "1000 text generations",
            "500 image generations",
            "24/7 VIP support",
            "Access to premium models",
            "Dedicated account manager",
        ],
    },
];

/* ------------------ GET PLANS ------------------ */

export const getPlans = async (
    _req: Request,
    res: Response
): Promise<Response> => {
    try {
        return res.status(200).json({ success: true, plans });
    } catch {
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
};

/* ------------------ STRIPE ------------------ */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/* ------------------ PURCHASE PLAN ------------------ */

export const purchasePlan = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const { planId } = req.body as { planId: string };
        const userId = (req.user as any)._id;

        const plan = plans.find((p) => p._id === planId);
        if (!plan) {
            return res
                .status(200)
                .json({ success: false, message: "Plan not found" });
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false,
        });

        const origin = req.headers.origin as string;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: plan.price * 100,
                        product_data: {
                            name: plan.name,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/loading`,
            cancel_url: origin,
            metadata: {
                transactionId: transaction._id.toString(),
                appId: "intellichat",
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        return res.status(200).json({ success: true, url: session.url });
    } catch (error: any) {
        return res
            .status(500)
            .json({ success: false, message: "Server Error" });
    }
};