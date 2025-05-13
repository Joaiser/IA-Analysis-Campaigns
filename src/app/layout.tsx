import "./globals.css";
import Providers from "@/app/components/Providers";
import { Metadata } from "next";

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
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

