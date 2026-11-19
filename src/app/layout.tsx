import type { Metadata } from "next";
import "./globals.css";
import "@/components/matchday.css";
export const metadata: Metadata = {
 title: "GOALQUBE — Your world of football",
 description: "Every match. Every club. Every moment that matters. Explore fixtures, standings, football news and the World Cup with Goalqube.",
 icons: { icon: "/brand/goalqube-logo-v6.png" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en" className="h-full antialiased"><body className="min-h-full flex flex-col">{children}</body></html>;
}
