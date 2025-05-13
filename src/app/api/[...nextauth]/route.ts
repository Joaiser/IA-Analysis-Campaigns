import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/app/lib/mongodb";

const handler = NextAuth({
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
                const db = client.db("ia_analisys_campaigns")
                const users = db.collection("users")

                const user = await users.findOne({ email: credentials?.email });
                if (!user) {
                    console.log("No user found with the email");
                    return null;
                }
                const isVailidPassword = await compare(
                    credentials!.password, user.password)
                if (!isVailidPassword) {
                    console.log("Password is not valid");
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                }
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
    }
});
export { handler as GET, handler as POST };