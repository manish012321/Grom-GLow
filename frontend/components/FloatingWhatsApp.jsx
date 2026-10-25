// frontend/components/FloatingWhatsApp.jsx
'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const phone = '919820100000';
  const defaultText = encodeURIComponent('Hello Groom & Glow! I would like to inquire about appointments and salon services.');
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultText}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#181715] text-[#25D366] hover:bg-[#25D366] hover:text-[#FFFFFF] shadow-xl border border-[#ECE7DE] hover:border-[#25D366] transition-all duration-300 transform hover:scale-105"
        aria-label="Chat with Groom & Glow concierge on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        
        {/* Tooltip on hover */}
        <span className="hidden md:group-hover:inline-block absolute right-16 bg-[#181715] text-[#FDFBF7] text-xs font-medium py-1.5 px-3 rounded-xs whitespace-nowrap shadow-lg border border-[#2A2825] transition-opacity">
          Chat with Concierge
        </span>
      </a>
    </div>
  );
}
