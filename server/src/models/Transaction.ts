import mongoose, { Schema, Document, Model } from "mongoose";

/* ------------------ TYPES ------------------ */

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    planId: string;
    amount: number;
    credits: number;
    isPaid: boolean;
}

/* ------------------ SCHEMA ------------------ */

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
            default: false,
        },
    },
    { timestamps: true }
);

/* ------------------ MODEL ------------------ */

const Transaction: Model<ITransaction> =
    mongoose.models.Transaction ||
    mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
