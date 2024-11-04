import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

interface MongooseConn {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

const cached: MongooseConn = (global as any).mongoose || { conn: null, promise: null };

if (!cached) {
    (global as any).mongoose = cached;
}

export const connect = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            dbName: 'rivine',
            bufferCommands: false,
            connectTimeoutMS: 30000,
        })
            .then(mongoose => {
                console.log('MongoDB Connected');
                return mongoose;
            })
            .catch(error => {
                console.error("MongoDB connection error:", error);
                cached.promise = null; // Reset the promise to allow reconnection
                throw error; // Rethrow error to handle it upstream
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
