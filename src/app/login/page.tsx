'use client';

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/"); // Redirigir a la página principal si ya está autenticado
        }
    }, [session, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/",
        });

        if (result?.error) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">
                Inicia Sesión
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                />
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white rounded p-2 w-full">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}
