import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        },
    },
    provider: {
        type: String,
        default: "local",
    },
    picture: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    }, { timestamps: true });


export default model("User", userSchema);
