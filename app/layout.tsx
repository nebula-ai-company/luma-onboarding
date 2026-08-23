import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

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
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body
        className={`${vazirmatn.className} bg-[#07070b] text-zinc-100 antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
