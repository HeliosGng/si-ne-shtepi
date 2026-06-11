/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, User, Clock, MessageSquare, UtensilsCrossed } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface ReservationProps {
  lang: Language;
}

export default function Reservation({ lang }: ReservationProps) {
  const t = TRANSLATIONS[lang];
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [notes, setNotes] = useState('');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !time) return;

    // Formatting WhatsApp link
    const phone = '+355693018832';
    
    const text = lang === 'sq'
      ? `Përshëndetje Si në Shtëpi! 🍽️\n\nDëshiroj të bëj një rezervim tavoline:\n` +
        `• Emri: ${name}\n` +
        `• Data: ${date}\n` +
        `• Ora: ${time}\n` +
        `• Personat: ${guests} persona\n` +
        (notes.trim() ? `• Shënime të veçanta: ${notes}\n` : '') +
        `\nJu lutem më konfirmoni nëse ka vend të lirë. Faleminderit!`
      : `Hello Si në Shtëpi! 🍽️\n\nI would like to request a table reservation:\n` +
        `• Name: ${name}\n` +
        `• Date: ${date}\n` +
        `• Time: ${time}\n` +
        `• Guests: ${guests} people\n` +
        (notes.trim() ? `• Special Notes: ${notes}\n` : '') +
        `\nPlease let me know if this is available. Thank you!`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodedText}`;
    
    // Open in new window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div id="reservation-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
      {/* Informative Side Banner */}
      <div id="reservation-info-banner" className="lg:col-span-5 bg-[#FCF9F2] border-2 border-[#FCD581] p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="p-3 w-12 h-12 rounded-xl bg-[#E07A2E] text-white flex items-center justify-center shadow-md">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'sq' ? 'Rezervoni Tavolinën Tuaj' : 'Secure Your Table'}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {lang === 'sq'
              ? 'Bashkohuni me ne për një vakt të paharrueshëm tradicionale! Pas plotësimit të formularit, kërkesa juaj do të hapet në WhatsApp për një konfirmim të shpejtë dhe të sigurt me stafin tonë.'
              : 'Join us for an unforgettable authentic dining experience! Once you submit the form, your request is generated into WhatsApp for an instant, high-touch confirmation with our staff.'}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-dashed border-[#FCD581]/60 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E07A2E]"></span>
            <span>{lang === 'sq' ? 'Menaxhohet direkt përmes WhatsApp' : 'Direct verification on WhatsApp'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#799F64]"></span>
            <span>{lang === 'sq' ? 'Ushqim taze i gatuar me porosi' : 'Freshly cooked to order'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
            <span>{lang === 'sq' ? 'Pa kosto shtesë ose parapagesë' : 'No hidden fees or active pre-payments'}</span>
          </div>
        </div>
      </div>

      {/* Actual Form */}
      <form
        id="booking-form"
        onSubmit={handleBook}
        className="lg:col-span-7 bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between"
      >
        <div className="space-y-4">
          {/* Reservation Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {t.reservationName} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all"
                placeholder="e.g. John Doe / Fatmir"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.reservationDate} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Calendar className="w-5 h-5" />
                </span>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.reservationTime} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Clock className="w-5 h-5" />
                </span>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Guests Select */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.reservationGuests}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((num) => (
                  <option key={num} value={num.toString()}>
                    {num} {num === 1 ? (lang === 'sq' ? 'person' : 'guest') : (lang === 'sq' ? 'persona' : 'guests')}
                  </option>
                ))}
              </select>
            </div>

            {/* Special notes input */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.reservationNotes}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E] focus:border-transparent transition-all"
                  placeholder={lang === 'sq' ? 'Karrige për fëmijë, ditëlindje, etj.' : 'Child seat, birthday event details, etc.'}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 rounded-xl bg-[#E07A2E] hover:bg-[#c96d27] text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.094-3.483l.411.244c1.61.956 3.47 1.461 5.4 1.462 5.561 0 10.086-4.519 10.089-10.081.002-2.693-1.04-5.228-2.937-7.127-1.897-1.898-4.425-2.943-7.124-2.944-5.567 0-10.096 4.522-10.1 10.086-.001 2.03.526 4.017 1.524 5.786l.267.473-.993 3.633 3.719-.974zm11.127-4.57c-.247-.124-1.463-.722-1.692-.804s-.395-.124-.562.124-.648.804-.797.973-.298.188-.545.064c-.247-.124-1.044-.384-1.988-1.223-.734-.655-1.23-1.465-1.373-1.712-.143-.246-.015-.38.11-.504.112-.11.247-.29.37-.435s.165-.247.247-.412c.083-.165.042-.31-.02-.434s-.562-1.353-.77-1.854c-.201-.483-.404-.417-.562-.424l-.479-.01c-.165 0-.433.061-.659.31-.227.247-.866.845-.866 2.06s.886 2.394.981 2.536c.095.14 1.743 2.662 4.223 3.731.59.255 1.05.408 1.41.523.593.188 1.134.161 1.56.097.475-.071 1.463-.598 1.668-1.176s.205-1.074.143-1.176c-.062-.103-.227-.165-.474-.29z" strokeWidth="0"></path>
          </svg>
          {t.bookViaWhatsapp}
        </button>
      </form>
    </div>
  );
}
