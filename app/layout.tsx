import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'لوما | پلتفرم هوش مصنوعی (LUMA AI)',
  description: 'تجربه آنبوردینگ هوشمند و ورود به پلتفرم جامع هوش مصنوعی لوما',
  openGraph: {
    title: 'لوما | پلتفرم هوش مصنوعی',
    description: 'تجربه ورود و شخصی‌سازی ابزارهای هوش مصنوعی لوما',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className="bg-[#07070b] text-zinc-100 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

