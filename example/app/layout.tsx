import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'react-godot-bridge example',
  description: 'Bidirectional React ↔ Godot bridge demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
