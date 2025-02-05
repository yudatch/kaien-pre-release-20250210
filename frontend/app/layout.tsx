import { Inter } from 'next/font/google';
import RootClientLayout from './RootClientLayout';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Accounting Software',
  description: 'Accounting management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased`}>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
