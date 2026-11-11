import { registerUser, resendOtp, verifyOtp, loginUser, loginWithGoogle } from "../services/auth.service.js";

export async function registerUserController(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const { newUser, expiresAt } = await registerUser(name, email, password);
        res.status(201).json({ message: "User registered successfully", data: { name: newUser.name, email: newUser.email, expiresAt } });
    } catch (error) {
        next(error);
    }
}




export async function resendOtpController(req, res, next) {
    try {
        const { email } = req.body;
        const { user, expiresAt } = await resendOtp(email);
        res.status(200).json({ message: "OTP resent successfully", data: { email: user.email, expiresAt } });
    } catch (error) {
        next(error);
    }
}


export async function verifyOtpController(req, res, next) {
    try {
        const { email, otp } = req.body;
        const verified = await verifyOtp(email , otp);
        res.status(200).json({ message: "OTP verified successfully", data: { email , verified } });
    } catch (error) {
        next(error);
    }
}


export async function loginUserController(req, res, next) {
    try {
    const {email , password} = req.body;
    const loggedInUser = await loginUser(email, password);
    res.status(200).json({ message: "User logged in successfully", data: loggedInUser });
    } catch (error) {
        next(error);
    }
}

export async function loginWithGoogleController(req, res, next) {
    try {
        const { idToken } = req.body;
        const loggedInUser = await loginWithGoogle(idToken);
        res.status(200).json({ message: "User logged in successfully", data: loggedInUser });
    } catch (error) {
        next(error);
    }
}