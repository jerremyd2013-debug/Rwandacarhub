import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Clock, 
  Send, 
  Check, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface ContactViewProps {
  onSendMessage?: (msg: {
    vehicleId: string;
    vehicleName: string;
    senderName: string;
    senderPhone: string;
    message: string;
  }) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onSendMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Vehicle Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg('Please enter a valid phone number with at least 8 digits (e.g. +250 788 225 193).');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address (e.g. user@example.com).');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setErrorMsg('Please write a brief message or question (at least 5 characters).');
      return;
    }

    if (onSendMessage) {
      onSendMessage({
        vehicleId: 'general-inquiry',
        vehicleName: `Inquiry: ${subject}`,
        senderName: name.trim(),
        senderPhone: phone.trim(),
        message: `${message.trim()} (Email: ${email.trim() || 'Not provided'})`
      });
    }

    setErrorMsg('');
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-sky-200 text-xs font-semibold text-sky-800 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span>Kigali Head Office</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-['Outfit',sans-serif]">
          Contact RwandaCarHub
        </h2>
        <p className="text-sm text-sky-950/80 font-medium">
          We are here to assist with vehicle purchases, showroom partnerships, listings, rentals, and test drive inspections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CONTACT INFO CARD (5 COLS) */}
        <div className="lg:col-span-5 bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 space-y-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
                Get In Touch
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Visit our Kigali headquarters or contact our automotive consultants.
              </p>
            </div>

            {/* Exact required contact items */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-400 block">Physical Address</span>
                  <span className="text-white font-bold">Rwanda, Kigali City, KK 713 St</span>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Kicukiro District, near Sonatubes</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block">Direct Telephone</span>
                  <a href="tel:+250788225193" className="text-white font-bold hover:text-red-400 transition-colors">
                    +250 788 225 193
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block">Official WhatsApp Support</span>
                  <a 
                    href="https://wa.me/250738225193" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    +250 738 225 193
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block">Official Email</span>
                  <a href="mailto:trust@rwandacarhub.com" className="text-white font-bold hover:text-red-400 transition-colors">
                    trust@rwandacarhub.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <Globe className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block">Website</span>
                  <span className="text-neutral-200 font-bold">www.rwandacarhub.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <Clock className="w-5 h-5 text-neutral-400 shrink-0" />
                <div>
                  <span className="text-xs text-neutral-400 block">Showroom & Support Hours</span>
                  <span className="text-white font-semibold">Monday – Saturday: 8:00 AM – 7:00 PM</span>
                  <p className="text-[11px] text-neutral-500">Sunday: By Appointment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-neutral-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-400 shrink-0" />
            <span>Dedicated Buyer Protection & Vehicle Transfer Assistance</span>
          </div>
        </div>

        {/* INTERACTIVE CONTACT & INQUIRY FORM (7 COLS) */}
        <div className="lg:col-span-7 bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
              Send Us a Direct Message
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Have questions about a car, listing pricing plans, or vehicle import? Fill out the form below.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-950/40 border border-emerald-800 rounded-2xl space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Thank You for Contacting Us!</h4>
              <p className="text-xs text-neutral-300 max-w-md mx-auto">
                Your inquiry has been received by our Kigali support team. We will respond within 15 minutes during normal working hours.
              </p>
            </div>
          ) : (
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div role="alert" className="p-3 bg-red-950/90 border border-red-700 text-red-200 text-xs rounded-xl font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-full-name" className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-full-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eric Bizimana"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone-number" className="block text-xs font-semibold text-neutral-300 mb-1">
                    Phone Number (Rwanda or International) *
                  </label>
                  <input
                    id="contact-phone-number"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 788 000 000"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email-addr" className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="contact-email-addr"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject-select" className="block text-xs font-semibold text-neutral-300 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    id="contact-subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                  >
                    <option value="Vehicle Inquiry">Inquiring About a Listed Car</option>
                    <option value="Listing Package">Seller Listing Plans (5k/15k/35k Frw)</option>
                    <option value="Dealer Registration">Dealership Registration</option>
                    <option value="Rental / Safari">Car Rental & Safari 4x4 Hire</option>
                    <option value="Pre-Inspection">Mechanical Pre-Purchase Inspection</option>
                    <option value="Other">Other Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message-body" className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Message *
                </label>
                <textarea
                  id="contact-message-body"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today with buying, selling, or renting cars in Rwanda?"
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                />
              </div>

              <button
                id="contact-form-submit-btn"
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-950/80 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
