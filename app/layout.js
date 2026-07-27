import "./globals.css";

export const metadata = {
  title: "Maya & Aarav — We’re getting married",
  description: "Join us for a weekend of love, laughter, and very questionable dancing."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
