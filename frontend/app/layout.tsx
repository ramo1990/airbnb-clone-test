import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";
import RegisterModal from "@/components/modals/RegisterModal";
import LoginModal from "@/components/modals/LoginModal";
import RentModal from "@/components/modals/RentModal";
import ClientLayout from "@/components/ClientLayout";

const font = Nunito({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb location appartement",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={font.className}>
        <Providers>
          <Toaster />
          <RegisterModal />
          <LoginModal />
          <RentModal />

          <ClientLayout>
            {children}
          </ClientLayout>

        </Providers>
      </body>
    </html>
  );
}