"use server";

import User from '@models/user.model';
import {connect} from "@lib/db";

export async function handleUser(user: any) {
    try {
        await connect();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser))
    } catch (error: any) {
        if (error.code === 11000) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                existingUser.lastName = user.lastName;
                existingUser.firstName = user.firstName;
                existingUser.photo = user.photo;

                return await existingUser.save();
            }
        }
        return null
    }
}

