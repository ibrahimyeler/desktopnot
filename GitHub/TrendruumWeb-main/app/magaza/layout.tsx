import type { Metadata } from 'next'
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Mağaza | Trendruum',
  description: 'Trendruum Mağaza Sayfası',
}

export default function MagazaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Sayfa İçeriği */}
      <main className="flex-1 w-full">
          {children}
      </main>
    </div>
  );
}