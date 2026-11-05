import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SOSA-outfits", description: "Sophisticated Samples" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('load',function(){try{if(window.Pi) window.Pi.init({version:"2.0",sandbox:true);}catch(e){}});` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
