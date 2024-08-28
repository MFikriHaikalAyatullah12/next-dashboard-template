import "@/app/ui/global.css";
import { lusitana } from "./ui/invoices/fonts";
// /app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>{children}</body>
    </html>
  );
}
