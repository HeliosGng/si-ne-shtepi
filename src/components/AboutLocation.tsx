/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Send, CheckCircle2, Navigation, Compass, Star } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';
import HoursIndicator from './HoursIndicator';

interface AboutLocationProps {
  lang: Language;
}

export default function AboutLocation({ lang }: AboutLocationProps) {
  const t = TRANSLATIONS[lang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => {
      setIsSent(false);
    }, 5000);
  };

  const handleDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/place/Si+n%C3%AB+Sht%C3%ABpi/@41.3257802,19.7768172,17z/data=!3m1!4b1!4m6!3m5!1s0x1350310065147dd3:0x1230164b094d7afe!8m2!3d41.3257771!4d19.7788114!16s%2Fg%2F11vrxjzrtj?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div id="about-location-container" className="space-y-12 animate-fadeIn">
      {/* Upper Grid: About Us and Hours */}
      <div id="about-us-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Story Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#E07A2E] bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 uppercase tracking-widest">
              {t.aboutUs}
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none pt-1">
              {lang === 'sq' ? 'Si në Shtëpi — Gatime Tradicionale' : 'Si në Shtëpi — Homestyle Tradition'}
            </h3>
          </div>

          <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-sans font-light">
            {t.aboutUsTextKey}
          </p>

          <div className="p-5 bg-[#FCF9F2] border-l-4 border-l-[#799F64] rounded-r-xl space-y-2">
            <h5 className="font-bold text-[#799F64] text-sm sm:text-base uppercase tracking-wider">
              {t.aboutUsCommitment}
            </h5>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">
              {t.aboutUsCommitmentText}
            </p>
          </div>
        </div>

        {/* Live Status and Contacts */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <h4 className="text-lg font-bold text-slate-900 border-b pb-3 mb-2 flex items-center justify-between">
            <span>{lang === 'sq' ? 'Statusi i dyqanit' : 'Shop Status'}</span>
            <span className="text-xs px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full font-mono font-medium">Nela 6</span>
          </h4>

          {/* Timezone / Live Hours Widget */}
          <HoursIndicator lang={lang} showDetails={true} />

          {/* Location details card */}
          <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#E07A2E] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-slate-800">{lang === 'sq' ? 'Adresa Jonë' : 'Business Address'}</p>
                <p className="text-slate-600">Rr. Engjëll Mashi, Yzberish, pranë Nela 6</p>
                <p className="text-slate-600 font-medium">Kashar, Tirana, Albania</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#799F64] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-slate-800">{lang === 'sq' ? 'Na Telefononi' : 'Call Staff'}</p>
                <a href="tel:+355693018832" className="text-[#E07A2E] hover:underline font-bold font-mono text-base tracking-wide">
                  +355 69 301 8832
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Real Map with Get Directions */}
      <div id="interactive-map-section" className="space-y-4">
        <div id="map-header-block" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#E07A2E]" />
              {lang === 'sq' ? 'Karta GPS e Vendndodhjes' : 'Interactive Location Map'}
            </h4>
            <p className="text-xs text-slate-500 font-sans mt-0.5">{t.visitUs}</p>
          </div>
          <button
            id="directions-map-btn"
            onClick={handleDirections}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold shadow-md transition-all duration-300 pointer-events-auto cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#FCD581] fill-[#FCD581]" />
            {t.getDirections}
          </button>
        </div>

        {/* Real OpenStreetMap Iframe box */}
        <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#DCE3EB] shadow-sm">
          <iframe
            id="openstreetmap-iframe"
            title="Si në Shtëpi Location Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src="https://www.openstreetmap.org/export/embed.html?bbox=19.7738%2C41.3228%2C19.7838%2C41.3288&layer=mapnik&marker=41.3257771%2C19.7788114"
            allowFullScreen
          />
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-[11px] font-sans font-medium text-slate-700 border border-slate-200 shadow-sm pointer-events-none">
            📍 Rr. Engjëll Mashi, Yzberish
          </div>
        </div>
      </div>

      {/* Bottom Form: Contact Form for quick inquiries */}
      <div id="quick-inquiries-form" className="bg-[#FCF9F2] p-6 sm:p-10 rounded-2xl border border-[#DCE3EB] space-y-6">
        <div className="space-y-1">
          <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.contactFormTitle}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {lang === 'sq' 
              ? 'Keni ndonjë pyetje për eventet, menunë familjare ose kateringun? Ndajeni këtu dhe do t\'ju përgjigjemi menjëherë.' 
              : 'Have any questions about custom events, catering, or today\'s bakes? Fill in and we will reach out soon.'}
          </p>
        </div>

        {isSent ? (
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold">{t.contactSuccess}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">{t.contactName}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all text-sm"
                  placeholder="e.g. Ahmet Hoxha / John"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">{t.contactEmail}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">{t.contactMessage}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all text-sm"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#799F64] hover:bg-[#688a54] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t.contactSend}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
