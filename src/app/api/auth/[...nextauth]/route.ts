// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/app/lib/mongodb";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db("test");
                const users = db.collection("users");


                const user = await users.findOne({
                    email: { $regex: new RegExp(`^${credentials?.email}$`, "i") }
                });

                if (!user) {
                    return null;
                }

                const isValidPassword = await compare(credentials!.password, user.password);
                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.role) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};

// handler para la API route
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
