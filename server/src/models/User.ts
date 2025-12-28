import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

/* ------------------ TYPES ------------------ */

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    credits: number;
    comparePassword(password: string): Promise<boolean>;
}

/* ------------------ SCHEMA ------------------ */

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        credits: {
            type: Number,
            default: 20,
        },
    },
    { timestamps: true }
);

/* ------------------ MIDDLEWARE ------------------ */
userSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/* ------------------ METHODS ------------------ */

userSchema.methods.comparePassword = async function (
    this: IUser,
    enteredPassword: string
): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

/* ------------------ MODEL ------------------ */

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
