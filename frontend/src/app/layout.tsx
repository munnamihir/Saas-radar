import type { Metadata } from 'next';
import '@/styles/globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'SaaS Radar — SaaS Spend Intelligence',
  description: 'Open source SaaS spend intelligence. Detect waste, eliminate ghost seats, and surface redundant tools automatically.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-16 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
