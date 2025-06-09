import bcrypt from "bcryptjs";
import { MongoClient } from 'mongodb';
import "dotenv/config";


interface User {
    email: string;
    password: string;
    role?: "admin" | "user";
    createdAt: Date;
}


const uri = process.env.MONGODB_URI;


if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
}

const client = new MongoClient(uri);

async function createUser(email: string, plainPassword: string): Promise<void> {
    try {
        await client.connect();
        const db = client.db();

        const usersCollection = db.collection<User>("users")

        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return;
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const user: User = {
            email,
            password: hashedPassword,
            role: "admin",
            createdAt: new Date()
        }

        const result = await usersCollection.insertOne(user);
        (`New user created with the following id: ${result.insertedId}`);
    } catch (error) {
        console.error("Error creating user:", error);
    } finally {
        await client.close();
    }
}

createUser("", "");