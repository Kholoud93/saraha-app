import bcrypt from "bcrypt";
import { findUserByEmail, registerUser as registerUserRepository, createUser as createUserRepository } from "../repositories/auth.repository.js";
import { timeToMs } from "../../utils/time.js";
import { generateOtp } from "../../utils/generate-otp.js";
import { carryOtp as carryOtpRepository } from "../repositories/otp.repository.js";
import { sendEmail } from "./email.service.js";
import { updateOtp as updateOtpRepository } from "../repositories/otp.repository.js";
import { verifyUser as verifyUserRepository } from "../repositories/otp.repository.js";
import { findOtp as findOtpRepository } from "../repositories/otp.repository.js";
import { deleteOtp as deleteOtpRepository } from "../repositories/otp.repository.js";
import { generateAccessToken } from "../../utils/token.js";
import { verifyIdToken } from "../../utils/google-oauth.js";

export async function registerUser(name, email, password) {
    const user = await findUserByEmail(email);
    if (user) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await registerUserRepository(name, email, hashedPassword);

    const otp = generateOtp().toString();
    const expiresAt = new Date(Date.now() + timeToMs(5, "m"));
    await carryOtpRepository(newUser._id, otp, expiresAt);
    await sendEmail(newUser.email, "OTP for verification", `Your OTP is ${otp}`);
    return { newUser, otp, expiresAt };
}

export async function resendOtp(email) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.isVerified) {
        throw new Error("User already verified");
    }
    const otp = generateOtp().toString();
    const expiresAt = new Date(Date.now() + timeToMs(5, "m"));
    const updatedOtp = await updateOtpRepository(user._id, otp, expiresAt);
    if (!updatedOtp) {
        throw new Error("Failed to update OTP");
    }
    await sendEmail(user.email, "OTP for verification", `Your OTP is ${otp}`);
    return { user, expiresAt };

}



export async function verifyOtp(email, otp) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    const foundOtp = await findOtpRepository(user._id);
    if (!foundOtp) {
        throw new Error("Invalid OTP");
    }
    if (foundOtp.otp !== otp) {
        throw new Error("Invalid OTP");
    }
    if (foundOtp.expiresAt < Date.now()) {
        throw new Error("OTP expired");
    }
    await verifyUserRepository(user._id);
    await deleteOtpRepository(user._id);    
    return true;
}



export async function loginUser(email, password) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid password");
    }
    if (!user.isVerified) {
        throw new Error("User not verified");
    }
    const accessToken = generateAccessToken({
        id: user._id,
        email: user.email,
    });
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
    };
}

export async function loginWithGoogle(idToken) {
    const payload = await verifyIdToken(idToken);
    let user = await findUserByEmail(payload.email);

    if (!user) {
        user = await createUserRepository({
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            provider: "Google",
            isVerified: true,
        });
    }

    const accessToken = generateAccessToken({
        id: user._id,
        email: user.email,
    });

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
    };
}