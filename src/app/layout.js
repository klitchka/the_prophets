import "./globals.css";
import { Inter } from "next/font/google";
import { StarknetProvider } from "./components/starknet-provider";
import styles from "./styles/page.module.css";
import Link from "next/link";
import Connect from "./components/Connect";
import Image from "next/image";
import Profile from "./profile/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StarknetKit",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className={styles.main}>
        <StarknetProvider>
          <div className={styles.navbar}>
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={200} height={100} />
            </Link>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <Link href="/marketplace">
                <p style={{ fontSize: 18 }}>Marketplace</p>
              </Link>
              <Link href="/bets">
                <p style={{ fontSize: 18 }}>Bets</p>
                </Link>
              <Link href="/profile">
                <p style={{ fontSize: 18 }}>Profile</p>
              </Link>
              <Connect />
            </div>
          </div>
          {children}
          <Profile />
          </StarknetProvider>
        </main>
      </body>
    </html>
  );
}
