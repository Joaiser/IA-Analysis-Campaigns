import type { Metadata } from "next";
import "./globals.css"; // Si tienes un archivo global de estilos
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Mi Aplicación", // Título más representativo de la app
  description: "Aplicación creada con Next.js", // Descripción más relevante
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
