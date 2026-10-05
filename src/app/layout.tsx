import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  metadataBase: new URL("https://magnm-org.vercel.app"),
  title: {
    default: "MAGNM — Creative Studio | Digital Experiences & 3D Engineering",
    template: "%s | MAGNM Creative Studio",
  },
  description:
    "MAGNM is an experimental creative studio engineering motion-driven websites, AI products, branding systems, and 3D digital flagships built for clarity and scale.",
  applicationName: "MAGNM Creative Studio",
  category: "Design & Technology",
  keywords: [
    "MAGNM",
    "MAGNM Creative Studio",
    "Creative Studio",
    "Digital Flagship",
    "Motion-Driven Design",
    "3D Web Experiences",
    "WebGL Studio",
    "Three.js Agency",
    "Brand Identity Systems",
    "AI Product Design",
    "Creative Engineering",
    "Indore Design Studio",
    "Next.js Development",
    "Interactive Websites",
    "High-Performance Web Design",
  ],
  authors: [
    { name: "Pranav Dubey" },
    { name: "Adarsh Pathade", url: "https://adrz-26.vercel.app/" },
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
    url: "https://magnm-org.vercel.app",
    siteName: "MAGNM Creative Studio",
    title: "MAGNM — Creative Studio | Digital Experiences & 3D Engineering",
    description:
      "Turning bold vision into visual language. Motion-driven websites, AI products, branding systems, and 3D digital flagships built for clarity, scale, and impact.",
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
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://magnm-org.vercel.app/#organization",
      "name": "MAGNM",
      "alternateName": ["MAGNM Creative Studio", "MAGNM Digital Flagships"],
      "url": "https://magnm-org.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://magnm-org.vercel.app/#logo",
        "url": "https://magnm-org.vercel.app/magnm%20light.png",
        "caption": "MAGNM Creative Studio Logo",
        "width": 1536,
        "height": 1024
      },
      "image": "https://magnm-org.vercel.app/magnm%20light.png",
      "email": "hello@magnm.com",
      "priceRange": "$$$$",
      "currenciesAccepted": "USD, EUR, GBP, INR",
      "paymentAccepted": "Wire Transfer, Credit Card",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Indore",
        "addressRegion": "Madhya Pradesh",
        "addressCountry": "IN"
      },
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": "Worldwide"
      },
      "founders": [
        {
          "@type": "Person",
          "name": "Pranav Dubey",
          "jobTitle": "Co-Founder & Creative Technologist"
        },
        {
          "@type": "Person",
          "name": "Adarsh Pathade",
          "jobTitle": "Co-Founder & Design Engineer",
          "sameAs": "https://adrz-26.vercel.app/"
        }
      ],
      "knowsAbout": [
        "Motion-Driven Web Experiences",
        "3D WebGL Engineering",
        "Brand Identity Systems",
        "AI Product Design & Spatial Tooling",
        "Creative Web Development",
        "Next.js App Architecture",
        "Three.js Real-time Shaders",
        "GSAP Timeline Animation"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "MAGNM Capabilities & Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Spatial & Motion-Driven Web Experiences",
              "description": "Timeline-choreographed digital flagships with micro-interactions, responsive physics, and smooth scroll synchronization."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "3D WebGL Digital Flagships & Interactive Environments",
              "description": "Real-time Three.js rendering, custom GLSL shaders, and performant 60fps 3D canvas experiences."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Scalable Brand Systems & Monochromatic Identities",
              "description": "Disciplined typography hierarchy, monochromatic visual identity, and strategic design guidelines."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Human-Centric AI Interfaces & Spatial Tooling",
              "description": "Generative AI product architecture, tactile prompt engineering interfaces, and intuitive AI tool suites."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Full-Stack Creative Engineering",
              "description": "High-performance Next.js development, React Server Components, Tailwind CSS, and Web Audio API acoustics."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Technical Architecture & High-Performance Web",
              "description": "Sub-second load times, 100/100 Core Web Vitals optimization, and enterprise SEO/GEO search infrastructure."
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://magnm-org.vercel.app/#website",
      "url": "https://magnm-org.vercel.app",
      "name": "MAGNM",
      "publisher": {
        "@id": "https://magnm-org.vercel.app/#organization"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://magnm-org.vercel.app/#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://magnm-org.vercel.app"
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://magnm-org.vercel.app/#webpage",
      "url": "https://magnm-org.vercel.app",
      "name": "MAGNM — Creative Studio | Digital Experiences & 3D Engineering",
      "isPartOf": {
        "@id": "https://magnm-org.vercel.app/#website"
      },
      "about": {
        "@id": "https://magnm-org.vercel.app/#organization"
      },
      "breadcrumb": {
        "@id": "https://magnm-org.vercel.app/#breadcrumbs"
      },
      "description": "MAGNM is an experimental creative studio engineering motion-driven websites, AI products, branding systems, and 3D digital flagships built for clarity and scale.",
      "workExample": [
        {
          "@type": "CreativeWork",
          "name": "Cero Terminal",
          "url": "https://cero-magnm.vercel.app/",
          "description": "Cero Cross-Platform Download Studio and terminal digital experience."
        },
        {
          "@type": "CreativeWork",
          "name": "Adarsh'26",
          "url": "https://adrz-26.vercel.app/",
          "description": "Adarsh'26 design engineering and portfolio showcase."
        },
        {
          "@type": "CreativeWork",
          "name": "Mirach Aerospace",
          "url": "https://mirach-aerospace.vercel.app/",
          "description": "Mirach Aerospace defence deep-tech and drone intelligence digital studio."
        }
      ]
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
        <Script
          id="scroll-restoration"
          strategy="beforeInteractive"
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

