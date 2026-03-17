// app/layout.tsx
import { Lora, Instrument_Serif, Instrument_Sans } from "next/font/google";
import "./globals.css";
import AuthWrapper from "@/components/AuthWrapper";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400", 
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin", "latin-ext"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${instrumentSerif.variable} ${instrumentSans.variable}`}>
      <body className="font-sans antialiased">
        <AuthWrapper>

        {children}
        </AuthWrapper>

      </body>
    </html>
  );
}