import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/Layout/SessionWrapper";
import { Inter } from 'next/font/google';
import { Toaster } from "react-hot-toast";

// ==============================================

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.APP_NAME,
  description: "Description du site web"
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="fr">
      <body className={inter.className} style={{padding: "32px"}}>
        <SessionWrapper>
          <div><Toaster/></div>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
