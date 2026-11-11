import OtpModel from "../models/otp.model.js";
import UserModel from "../models/user.model.js";

export async function carryOtp(userId, otp, expiresAt) {
    const newOtp = new OtpModel({
        user: userId,
        otp: otp,
        expiresAt: expiresAt,
    });
    await newOtp.save();
    return newOtp;
}



export async function updateOtp(userId, otp, expiresAt) {
    const updatedOtp = await OtpModel.findOneAndUpdate(
        { user: userId },
        {
            user: userId,
            otp: otp,
            expiresAt: expiresAt,
        },
        { returnDocument: "after", upsert: true }
    );
    return updatedOtp;
}


export async function verifyUser(userId) {
 const verifiedUser = await UserModel.findOneAndUpdate(
    { _id: userId },
    { isVerified: true },
    { new: true }
 );
 return verifiedUser;
}


export async function findOtp(userId, otp) {
    const foundOtp = await OtpModel.findOne({ user: userId});
    return foundOtp;
}

export async function deleteOtp(userId) {
    await OtpModel.deleteOne({ user: userId });
}