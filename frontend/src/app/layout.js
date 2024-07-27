import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Git Scanner",
  description: "Generate Repository Reports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
      <Navbar />
      <div className="main-content">
        {children}
      </div>
    </body>
  </html>
  );
}
