import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';

import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import './global.css';

const OnchainProviders = dynamic(
  () => import('src/components/OnchainProviders'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'Onchain App Template',
  description: 'Built with OnchainKit',
  openGraph: {
    title: 'Onchain App Template',
    description: 'Built with OnchainKit',
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex items-center justify-center w-[100vw] overflow-x-hidden relative">
        <div className="h-screen w-screen overflow-hidden absolute top-0 left-0 pointer-events-none">
          <div className="absolute top-3 -left-36 w-72 h-72 bg-brand/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 pointer-events-none animate-blob" />
          <div className="absolute top-1/3 -right-56 w-96 h-96 aspect-square bg-brand/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 pointer-events-none animate-blob" />
          <div className="absolute -bottom-1/3 -left-1/2  w-96 h-96 aspect-square bg-brand/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 pointer-events-none animate-blob" />
        </div>
        <OnchainProviders>
          {children}
          <Toaster />
        </OnchainProviders>
      </body>
    </html>
  );
}
