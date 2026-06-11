/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language } from '../types';

interface HoursIndicatorProps {
  lang: Language;
  showDetails?: boolean;
}

export default function HoursIndicator({ lang, showDetails = false }: HoursIndicatorProps) {
  const [albTimeStr, setAlbTimeStr] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(1); // 0 = Sunday, 1 = Monday, etc.

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        // Convert to Albania Time Zone dynamically using Intl
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Europe/Tirane',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        
        const timeParts = formatter.formatToParts(now);
        const hourVal = parseInt(timeParts.find(p => p.type === 'hour')?.value || '12', 10);
        const minVal = parseInt(timeParts.find(p => p.type === 'minute')?.value || '00', 10);

        // Get day of week in Albania
        const albDateStr = now.toLocaleString('en-US', { timeZone: 'Europe/Tirane' });
        const albDate = new Date(albDateStr);
        const day = albDate.getDay(); // 0 is Sunday, 1-6 Mon-Sat

        setDayOfWeek(day);

        // Standard string representation
        const pad = (n: number) => n.toString().padStart(2, '0');
        setAlbTimeStr(`${pad(hourVal)}:${pad(minVal)}`);

        // Business rules: Closed on Sundays. Open 08:00 - 22:00 (8:00 AM to 10:00 PM) on other days.
        if (day === 0) {
          setIsOpen(false);
        } else {
          const totalMins = hourVal * 60 + minVal;
          const openMins = 8 * 60; // 08:00 AM
          const closeMins = 22 * 60; // 10:00 PM
          setIsOpen(totalMins >= openMins && totalMins < closeMins);
        }
      } catch (err) {
        console.error('Error calculating Albania timezone:', err);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = TRANSLATIONS[lang];

  // Map day index to localized string
  const dayNames = [t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday];

  return (
    <div id="hours-indicator-box" className="flex flex-col gap-1 items-start">
      <div className="flex items-center gap-2">
        {isOpen ? (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="relative flex h-3 w-3">
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        )}

        <span className={`text-sm font-semibold tracking-tight uppercase ${isOpen ? 'text-emerald-700' : 'text-amber-800'}`}>
          {isOpen ? t.openStatus : t.closedStatus}
        </span>

        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
          Tirana: {albTimeStr}
        </span>
      </div>

      {showDetails && (
        <div className="text-xs text-slate-500 mt-1 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 font-sans">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>
              {t.monSat}: <strong className="text-slate-700">08:00 - 22:00</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-700 font-medium">
            <Clock className="w-3 h-3 text-rose-400" />
            <span>{t.closedSundays}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 italic">
            {t.albanianTime}: {dayNames[dayOfWeek]}
          </div>
        </div>
      )}
    </div>
  );
}
