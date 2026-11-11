import UserModel from "../models/user.model.js";

export async function registerUser(name, email, password) {
    const user = await UserModel.create({ name, email, password });
    return user;
}


export async function findUserByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user;
}

export async function createUser(userData) {
    const user = await UserModel.create(userData);
    return user;
}


