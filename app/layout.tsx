import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

const siteUrl = "https://starting-xi-phi.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StartinXI | Build Your Football Starting XI",
    template: "%s | StartinXI",
  },
  description:
    "Create football lineups, choose formations, place players on the pitch, and share your perfect starting XI.",
  keywords: [
    "football lineup builder",
    "starting XI builder",
    "soccer lineup creator",
    "football formation builder",
    "team sheet generator",
    "football tactics board",
    "soccer formation creator",
  ],
  authors: [{ name: "StartinXI" }],
  creator: "StartinXI",
  applicationName: "StartinXI",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "StartinXI",
    title: "StartinXI | Build Your Football Starting XI",
    description:
      "Pick a formation, add your players, arrange your team on the pitch, and share your football lineup.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StartinXI football lineup builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StartinXI | Build Your Football Starting XI",
    description:
      "Create, arrange, save, and share football lineups in seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body className="font-body">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
