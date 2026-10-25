// frontend/app/contact/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
          Personal Concierge
        </span>
        <h1 className="font-editorial text-5xl sm:text-6xl font-light text-[#181715] mt-2">
          Contact & Location
        </h1>
        <p className="text-sm text-[#736E67] mt-3 font-light leading-relaxed">
          Our concierge team is at your immediate disposal for booking arrangements, wedding suite reservations, or customized treatment questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info & Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-white border border-[#ECE7DE] rounded-xs shadow-xs space-y-6">
            <h3 className="font-editorial text-2xl font-normal text-[#181715]">
              Atelier Coordinates
            </h3>

            <div className="space-y-4 text-sm text-[#4A4744]">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#181715] font-medium">Groom & Glow Unisex Salon</strong>
                  <span className="font-light">42 Heritage Promenade, Linking Road, Bandra West, Mumbai 400050, Maharashtra, India</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Phone className="w-5 h-5 text-[#C5A880] shrink-0" />
                <div>
                  <strong className="block text-[#181715] font-medium">Direct Line</strong>
                  <a href="tel:+919820100000" className="hover:text-[#C5A880] transition-colors font-light">
                    +91 98201 00000
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Mail className="w-5 h-5 text-[#C5A880] shrink-0" />
                <div>
                  <strong className="block text-[#181715] font-medium">Concierge Email</strong>
                  <a href="mailto:concierge@groomandglow.com" className="hover:text-[#C5A880] transition-colors font-light">
                    concierge@groomandglow.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#181715] font-medium">Salon Hours</strong>
                  <span className="block font-light text-xs">Monday – Saturday: 09:00 AM – 08:00 PM</span>
                  <span className="block font-light text-xs">Sunday: 10:00 AM – 06:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECE7DE]">
              <a
                href="https://wa.me/919820100000?text=Hello%20Groom%20%26%20Glow%2C%20I%20would%20like%20to%20speak%20with%20the%20concierge."
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-button-primary w-full text-xs text-center bg-[#25D366] border-[#25D366] hover:bg-[#1EBE5D] text-white hover:text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Valet & Accessibility Note */}
          <div className="p-6 bg-[#F7F4EE] border border-[#ECE7DE] rounded-xs text-xs text-[#736E67] space-y-2">
            <h4 className="font-editorial text-lg text-[#181715] font-normal">
              Valet & Private Parking
            </h4>
            <p className="font-light leading-relaxed">
              Complimentary valet parking is provided at our front portico. Private VIP entrance available for wedding parties upon advance notice.
            </p>
          </div>
        </div>

        {/* Message Form & Map */}
        <div className="lg:col-span-7 space-y-8">
          {/* Inquiry Form */}
          <div className="p-8 bg-white border border-[#ECE7DE] rounded-xs shadow-xs">
            <h3 className="font-editorial text-2xl font-normal text-[#181715] mb-2">
              Send a Note to Concierge
            </h3>
            <p className="text-xs text-[#736E67] mb-6 font-light">
              We respond to all written inquiries within 2 hours during atelier operating hours.
            </p>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-2 bg-[#FDFBF7] border border-[#ECE7DE]">
                <CheckCircle2 className="w-10 h-10 text-[#C5A880] mx-auto mb-2" />
                <h4 className="font-editorial text-2xl text-[#181715]">
                  Message Received
                </h4>
                <p className="text-xs text-[#736E67]">
                  Our concierge team will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meera Mehta"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98201 XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1.5">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715] bg-white"
                    >
                      <option>General Inquiry</option>
                      <option>Bridal Suite Booking</option>
                      <option>Membership Enrollment</option>
                      <option>Corporate / Event Styling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#181715] mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How may our concierge assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#ECE7DE] rounded-xs text-sm focus:outline-none focus:border-[#181715] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="luxury-button-primary w-full py-3 text-xs tracking-widest"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            )}
          </div>

          {/* Google Maps Embed */}
          <div className="border border-[#ECE7DE] rounded-xs overflow-hidden h-72 shadow-xs relative bg-[#ECE7DE]">
            <iframe
              title="Groom & Glow Salon Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.464673628469!2d72.83311681482084!3d19.065261987093957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9113697e6bf%3A0xa647895e7c80521e!2sLinking%20Rd%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1629892019483!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
