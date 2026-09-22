import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vision Tech - WhatsApp Webhook & Messaging Management System',
  description: 'Meta WhatsApp Business API Webhook integration and messaging dashboard for CRM software.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./vision-tech-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#0b141a] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
