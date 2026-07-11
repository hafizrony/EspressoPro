import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#faf9f8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', 
};

export const metadata: Metadata = {
  title: 'EspressoPro',
  description: 'EspressoPro Management System',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EspressoPro',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}