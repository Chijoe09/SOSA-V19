import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOSA-outfits",
  description: "Sophisticated Samples",
};

const themeScript = `try{var t=localStorage.getItem('sosa-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
      </head>
      <body className="bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
        <header className="p-4 flex justify-between items-center border-b">
          <a href="/" className="font-bold text-xl">SOSA-outfits</a>
          <nav className="flex gap-4 text-sm">
            <a href="/">Shop</a>
            <a href="/admin">Admin</a>
          </nav>
        </header>
        {children}
        <footer className="p-4 text-center text-sm opacity-60 border-t">
          © SOSA-outfits - Sophisticated Samples
        </footer>
      </body>
    </html>
  );
}
