// frontend/app/layout.js
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export const metadata = {
  title: 'Groom & Glow — Beauty, refined. | Modern Unisex Salon',
  description: 'An architectural unisex salon offering bespoke hair design, clinical facials, royal beard sculpting, and holistic spa rituals in Bandra West, Mumbai.',
  keywords: 'unisex salon Mumbai, luxury haircut, balayage hair color, hydrafacial, beard sculpting, Groom and Glow',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#FDFBF7'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#181715] antialiased selection:bg-[#C5A880] selection:text-[#181715]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
