import type { Request, Response } from "express";
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

/* ------------------ STRIPE INSTANCE ------------------ */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/* ------------------ WEBHOOK CONTROLLER ------------------ */

export const stripeWebhooks = async (
    request: Request,
    response: Response
): Promise<Response | void> => {
    const sig = request.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    /* ---------- VERIFY SIGNATURE ---------- */
    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        return response
            .status(400)
            .send(`Webhook Error: ${error.message}`);
    }

    /* ---------- HANDLE EVENTS ---------- */
    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const sessions = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                    limit: 1,
                });

                const session = sessions.data[0];

                if (!session) {
                    return response.json({
                        received: true,
                        message: "Checkout session not found",
                    });
                }

                const metadata = session.metadata as {
                    transactionId?: string;
                    appId?: string;
                };

                if (metadata?.appId !== "intellichat") {
                    return response.json({
                        received: true,
                        message: "Ignored event: Invalid app",
                    });
                }

                const transaction = await Transaction.findOne({
                    _id: metadata.transactionId,
                    isPaid: false,
                });

                if (!transaction) {
                    return response.json({
                        received: true,
                        message: "Transaction not found or already processed",
                    });
                }

                // Increment user credits
                await User.updateOne(
                    { _id: transaction.userId },
                    { $inc: { credits: transaction.credits } }
                );

                // Mark transaction as paid
                transaction.isPaid = true;
                await transaction.save();

                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }

        return response.json({ received: true });
    } catch (error: any) {
        return response
            .status(500)
            .send(`Webhook handling error: ${error.message}`);
    }
};