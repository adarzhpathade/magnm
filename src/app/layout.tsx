import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const familjenGrotesk = localFont({
  src: "../fonts/FamiljenGroteskVariable_Regular-s.p.04jxz-d23sc_e.woff2",
  variable: "--font-familjen",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAGNM — Creative Studio",
  description: "Turning vision into visual language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", familjenGrotesk.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-[#0c0c0c] text-[#cccccc] font-sans selection:bg-[#4d4d4d] selection:text-white">
        {children}
      </body>
    </html>
  );
}

