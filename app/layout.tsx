import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JalSutra – Ancient Wisdom. Living Rivers.",
  description:
    "Join the movement to protect India's rivers. Report biodiversity, share knowledge, participate in eco-missions, and become a River Guardian.",
  keywords: "river conservation, Ganga, India, ecology, biodiversity, JalSutra",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
