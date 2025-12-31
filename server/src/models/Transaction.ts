import mongoose, { Schema, Document, Model } from "mongoose";

/* ------------------ TYPES ------------------ */

/**
 * Transaction document used for Stripe payments
 */
export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId; // user who made the purchase
    planId: string;                 // purchased plan identifier
    amount: number;                 // amount paid (USD)
    credits: number;                // credits to be added
    isPaid: boolean;                // payment confirmation status
}

/* ------------------ SCHEMA ------------------ */

/**
 * Schema for storing payment transactions
 */
const transactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        planId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        credits: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false, // marked true after Stripe webhook success
        },
    },
    { timestamps: true }
);

/* ------------------ MODEL ------------------ */

/**
 * Transaction model
 * Prevents model overwrite during hot reload
 */
const Transaction: Model<ITransaction> =
    mongoose.models.Transaction ||
    mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;