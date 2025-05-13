'use client'; // Añade esta línea para hacer que el componente se ejecute en el cliente

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={new QueryClient()}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
