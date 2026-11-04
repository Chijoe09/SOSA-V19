import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "SOSA-outfits", description: "Sophisticated Samples" };

const themeScript = `try{var t=localStorage.getItem('sosa-theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
      </head>
      <body className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
