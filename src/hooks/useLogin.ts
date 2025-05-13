import { signIn } from "next-auth/react";

export const useLogin = () => {
    const login = async ({
        email,
        password
    }: {
        email: string;
        password: string;
    }) => {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if (!result) throw new Error("No hubo respuesta")
        if (result.error) throw new Error(result.error)
        return result;
    }

    return { login };
}