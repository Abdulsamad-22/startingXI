import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { FeedbackSupport } from "@/components/FeedbackSupport";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} bg-[#555958] text-white`}
    >
      <body className="font-body">
        <AuthProvider>
          {children}

          <FeedbackSupport
            xUrl="https://x.com/_Hoossayn"
            instagramUrl="https://www.instagram.com/hoosayn_10?igsh=MWQzNDRlaHVnaTJqOA=="
          />
        </AuthProvider>
      </body>
    </html>
  );
}
