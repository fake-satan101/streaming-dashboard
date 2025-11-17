import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { WishlistProvider } from '@/context/WishlistContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamFlix - Your Streaming Dashboard',
  description: 'A Netflix-like streaming service dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <WishlistProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </WishlistProvider>
      </body>
    </html>
  );
}