/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Instagram, 
  MapPin, 
  BookOpen, 
  Star, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  Utensils, 
  Menu as MenuIcon, 
  Phone,
  CheckCircle,
  Globe
} from 'lucide-react';

import { MenuItem, Language, CartItem } from './types';
import { TRANSLATIONS } from './translations';
import MenuSection from './components/MenuSection';
import AboutLocation from './components/AboutLocation';
import Reviews from './components/Reviews';
import Reservation from './components/Reservation';
import Cart from './components/Cart';
import HoursIndicator from './components/HoursIndicator';

export default function App() {
  const [lang, setLang] = useState<Language>('sq');
  const [activeTab, setActiveTab] = useState<'menu' | 'location' | 'reviews' | 'reservation'>('menu');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  // Cart Handlers
  const handleAddToCart = (item: MenuItem, qty: number, weightKg?: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.menuItem.id === item.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        if (item.isByKg && weightKg !== undefined) {
          copy[existingIdx].weightKg = weightKg;
        } else {
          copy[existingIdx].quantity += qty;
        }
        return copy;
      }
      return [...prev, { menuItem: item, quantity: qty, weightKg }];
    });

    // INSTANTLY display cart drawer
    setIsCartOpen(true);

    // Show beautiful toast confirmation
    setToastMessage(lang === 'sq' ? `👉 ${item.nameSq} u shtua në shportë!` : `👉 ${item.nameEn} added to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUpdateQty = (itemId: string, diff: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.menuItem.id === itemId) {
          const next = item.quantity + diff;
          return { ...item, quantity: next < 1 ? 1 : next };
        }
        return item;
      })
    );
  };

  const handleUpdateWeight = (itemId: string, newWeight: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.menuItem.id === itemId) {
          return { ...item, weightKg: newWeight < 0.25 ? 0.25 : newWeight };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.menuItem.id !== itemId));
  };

  const totalCartCount = cartItems.length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-slate-800 antialiased selection:bg-[#FCD581]/70">
      
      {/* Top micro helper header / Language Switcher & Instagram */}
      <div className="w-full bg-slate-900 text-white/95 text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
              <Phone className="w-3 h-3 text-[#FCD581]" />
              +355 69 301 8832
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#E07A2E]" />
              Kashar, Albania (pranë Nela 6)
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto sm:ml-0 justify-between w-full sm:w-auto">
            {/* Instagram Social Trigger icon */}
            <a
              href="https://www.instagram.com/_sineshtepi/"
              target="_blank"
              rel="noopener referrer"
              className="group flex items-center gap-1.5 text-slate-300 hover:text-[#E07A2E] text-[11px] bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full transition-all"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500 group-hover:scale-110 transition-transform" />
              <span>Instagram</span>
            </a>

            {/* Language Switcher Buttons combo */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-full border border-slate-700">
              <button
                type="button"
                onClick={() => setLang('sq')}
                className={`px-2.5 py-1 rounded-full transition-all font-bold text-[10px] flex items-center gap-1 cursor-pointer ${
                  lang === 'sq' ? 'bg-[#E07A2E] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>AL</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full transition-all font-bold text-[10px] flex items-center gap-1 cursor-pointer ${
                  lang === 'en' ? 'bg-[#E07A2E] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Branding Header Banner */}
      <header className="w-full bg-white border-b border-slate-100 py-6 sm:py-8 px-4 relative shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Brand Frame */}
          <div className="text-center md:text-left space-y-2 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E07A2E] to-[#FCD581] flex items-center justify-center shadow-lg text-white">
              <Utensils className="w-8 h-8" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display flex items-center justify-center md:justify-start gap-1">
                {t.title}
              </h1>
              <p className="text-sm font-medium text-[#799F64] tracking-wide">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Stats Block with Live Clock */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Live timezone business status panel */}
            <div className="bg-[#FCF9F2] border border-[#FCD581]/50 p-4 rounded-xl shadow-sm text-sm">
              <HoursIndicator lang={lang} />
            </div>

            {/* Shopping Bag trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3.5 rounded-xl bg-[#FCD581] hover:bg-[#ebbe5c] text-slate-900 hover:text-black border border-[#DCE3EB]/30 shadow-md transition-all duration-300 flex items-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E07A2E] text-white text-[10px] font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalCartCount}
                </span>
              )}
              <span className="text-xs font-bold font-mono tracking-tight">{lang === 'sq' ? 'Shporta' : 'Cart'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Global Banner Notifications (Toasts) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white py-3.5 px-5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-slideDown max-w-sm">
          <CheckCircle className="w-5 h-5 text-[#FCD581] flex-shrink-0" />
          <p className="text-xs sm:text-sm font-semibold tracking-tight leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* Tab Navigation Menu Area */}
      <nav id="desktop-tab-navigator" className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex w-full overflow-x-auto justify-start sm:justify-center px-4 scrollbar-none py-1 gap-1 sm:gap-2">
            {[
              { id: 'menu', label: t.menu, icon: BookOpen },
              { id: 'location', label: t.location, icon: MapPin },
              { id: 'reviews', label: t.reviews, icon: Star },
              { id: 'reservation', label: t.reservations, icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-link-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as 'menu' | 'location' | 'reviews' | 'reservation');
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 py-3.5 px-3 sm:px-5 font-bold text-xs sm:text-sm tracking-tight border-b-2 uppercase transition-all flex-shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#E07A2E] text-[#E07A2E]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Core Responsive Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        <div id="active-tab-outlet" className="pb-16">
          {activeTab === 'menu' && (
            <MenuSection lang={lang} onAddToCart={handleAddToCart} />
          )}

          {activeTab === 'location' && (
            <AboutLocation lang={lang} />
          )}

          {activeTab === 'reviews' && (
            <Reviews lang={lang} />
          )}

          {activeTab === 'reservation' && (
            <Reservation lang={lang} />
          )}
        </div>
      </main>

      {/* Side Slide-Out Overlay for Shopping Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Black ambient backdrop */}
          <div
            id="cart-backdrop"
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Cart Sidebar Panel */}
          <div className="relative w-full max-w-md h-full shadow-2xl animate-fadeIn">
            <Cart
              lang={lang}
              cartItems={cartItems}
              onUpdateQty={handleUpdateQty}
              onUpdateWeight={handleUpdateWeight}
              onRemoveItem={handleRemoveItem}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Elegant footer details */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h5 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5">
              <Utensils className="w-5 h-5 text-[#E07A2E]" />
              {t.title}
            </h5>
            <p className="text-xs font-light text-slate-400 leading-relaxed max-w-sm">
              {lang === 'sq'
                ? 'Gatime plot dashuri me shije shtëpiake nën standardin më cilësor në Kashar, Shqipëri. Ju mirëpresim ose ju dërgojmë porosinë kudo që ndodheni me GPS saktësi.'
                : 'Homemade Albanian food baked with love in Kashar, Albania. Welcome to our table or order fresh hot delivery right to your exact GPS coordinates.'}
            </p>
          </div>

          <div className="space-y-3 font-sans">
            <h6 className="font-bold text-white text-sm uppercase tracking-wide">
              {lang === 'sq' ? 'Na Gjeni' : 'Find Us'}
            </h6>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              📍 Rr. Engjëll Mashi, Yzberish, pranë Nela 6, Kashar, Albania
            </p>
            <p className="text-xs text-slate-400 font-mono">
              📞 +355 69 301 8832
            </p>
          </div>

          <div className="space-y-3">
            <h6 className="font-bold text-white text-sm uppercase tracking-wide">
              {lang === 'sq' ? 'Socialet' : 'Instagram Social'}
            </h6>
            <a
              href="https://www.instagram.com/_sineshtepi/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-inner transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>@_sineshtepi</span>
            </a>
            <p className="text-[11px] text-slate-500 italic mt-1 font-mono">
              © {new Date().getFullYear()} {t.title} - {lang === 'sq' ? 'Kashar, Shqipëri' : 'Kashar, Albania'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
