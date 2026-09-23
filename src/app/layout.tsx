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

const neueHaasDisplay = localFont({
  src: "../fonts/NeueHaasDisplay_Roman-s.p.0ykdwddnvy5f_.woff2",
  variable: "--font-neue-haas",
  display: "swap",
});

const ppEditorialNew = localFont({
  src: "../fonts/PPEditorialNew_Ultralight-s.p.0qe_2frr_fmiu.woff2",
  variable: "--font-editorial",
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
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        familjenGrotesk.variable,
        neueHaasDisplay.variable,
        ppEditorialNew.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-[#0c0c0c] text-[#cccccc] font-sans selection:bg-[#4d4d4d] selection:text-white">
        {children}
      </body>
    </html>
  );
}

