import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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

const martianMono = localFont({
  src: "../fonts/MartianMono_Light-s.p.0htes.s6weu9-.woff2",
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://magnm.com"),
  title: {
    default: "MAGNM — Creative Studio | Digital Experiences & 3D Engineering",
    template: "%s | MAGNM Creative Studio",
  },
  description:
    "MAGNM is an experimental creative studio based in Indore. We engineer motion-driven websites, AI products, branding systems, and 3D digital flagships built for clarity, scale, and impact.",
  applicationName: "MAGNM Creative Studio",
  keywords: [
    "MAGNM",
    "Creative Studio",
    "Digital Flagship",
    "Motion-Driven Design",
    "3D Web Experiences",
    "WebGL",
    "Three.js",
    "Brand Identity",
    "AI Products",
    "Creative Engineering",
    "Indore Design Studio",
    "Next.js Development",
  ],
  authors: [
    { name: "Pranav Dubey" },
    { name: "Adarsh Pathade" },
  ],
  creator: "MAGNM",
  publisher: "MAGNM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://magnm.com",
    siteName: "MAGNM Creative Studio",
    title: "MAGNM — Creative Studio | Digital Experiences & 3D Engineering",
    description:
      "Turning bold vision into visual language. Motion-driven websites, AI products, and digital flagships built for clarity, scale, and impact.",
    images: [
      {
        url: "/magnm light.png",
        width: 1536,
        height: 1024,
        alt: "MAGNM Creative Studio Metallic Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAGNM — Creative Studio | Digital Experiences & 3D Engineering",
    description:
      "Turning bold vision into visual language. Motion-driven websites, AI products, and 3D digital flagships.",
    images: ["/magnm light.png"],
    creator: "@magnm_studio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://magnm.com/#organization",
      "name": "MAGNM",
      "alternateName": "MAGNM Creative Studio",
      "url": "https://magnm.com",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://magnm.com/#logo",
        "url": "https://magnm.com/magnm%20light.png",
        "caption": "MAGNM Creative Studio Logo"
      },
      "image": "https://magnm.com/magnm%20light.png",
      "email": "adarshpathade79@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Indore",
        "addressRegion": "Madhya Pradesh",
        "addressCountry": "IN"
      },
      "founders": [
        {
          "@type": "Person",
          "name": "Pranav Dubey"
        },
        {
          "@type": "Person",
          "name": "Adarsh Pathade"
        }
      ],
      "knowsAbout": [
        "Motion-Driven Web Experiences",
        "3D WebGL Engineering",
        "Brand Identity Systems",
        "AI Product Design",
        "Creative Web Development"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://magnm.com/#website",
      "url": "https://magnm.com",
      "name": "MAGNM",
      "publisher": {
        "@id": "https://magnm.com/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://magnm.com/#webpage",
      "url": "https://magnm.com",
      "name": "MAGNM — Creative Studio",
      "isPartOf": {
        "@id": "https://magnm.com/#website"
      },
      "about": {
        "@id": "https://magnm.com/#organization"
      },
      "description": "Translating bold vision into lasting impact. Websites, AI products, brands, and systems built for clarity, scale and impact."
    }
  ]
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
        martianMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0c0c0c] text-[#cccccc] font-sans selection:bg-[#4d4d4d] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

