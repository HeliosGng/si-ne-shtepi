/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingCart, Trash2, MapPin, Check, AlertCircle, ShoppingBag, X } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language, CartItem } from '../types';

interface CartProps {
  lang: Language;
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, diff: number) => void;
  onUpdateWeight: (itemId: string, newWeight: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClose: () => void;
}

export default function Cart({
  lang,
  cartItems,
  onUpdateQty,
  onUpdateWeight,
  onRemoveItem,
  onClose,
}: CartProps) {
  const t = TRANSLATIONS[lang];
  
  // Geolocation states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');

  // Calculate order total
  const orderTotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.menuItem.isByKg
      ? item.menuItem.price * (item.weightKg || 1.0)
      : item.menuItem.price * item.quantity;
    return acc + itemPrice;
  }, 0);

  // Trigger GPS retrieval
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsError(lang === 'sq' ? 'Kërkuesi juaj nuk mbështet GPS.' : 'Your browser does not support Geolocation.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsLoading(false);
        setGpsError(
          lang === 'sq'
            ? 'Nuk u mor dot lokacioni automatik (Ju mund të shkruani adresën specifike në fushën më poshtë).'
            : 'Could not access GPS. Please type your delivery address in the box below.'
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Submit order to WhatsApp
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const phone = '+355693018832';
    
    // Header
    let text = lang === 'sq'
      ? `Pershendetje Si në Shtëpi! 🛒\n\nDeshiroj te bej nje porosi per dërgesë (Delivery):\n`
      : `Hello Si në Shtëpi! 🛒\n\nI would like to place a delivery order:\n`;

    // Item List
    cartItems.forEach((item, i) => {
      const isKg = !!item.menuItem.isByKg;
      const title = lang === 'sq' ? item.menuItem.nameSq : item.menuItem.nameEn;
      if (isKg) {
        const weight = item.weightKg || 1.0;
        const price = Math.round(item.menuItem.price * weight);
        text += `${i + 1}. *${title}* (${weight.toFixed(2)} ${t.kg}) → ${price} ALL\n`;
      } else {
        const price = item.menuItem.price * item.quantity;
        text += `${i + 1}. *${title}* (x${item.quantity}) → ${price} ALL\n`;
      }
    });

    // Total
    text += `\n*TOTALI: ${orderTotal} ALL*\n`;

    // GPS location attachment details
    if (gpsCoords) {
      text += `\n📍 *Lokacioni im GPS per dërgim:* https://www.google.com/maps/search/?api=1&query=${gpsCoords.lat},${gpsCoords.lon}\n`;
    }

    // Manual address description
    if (manualAddress.trim()) {
      text += `\n🏠 *Adresa e dërgimit:* ${manualAddress}\n`;
    } else if (!gpsCoords) {
      text += lang === 'sq'
        ? `\n(Shenim: Do t'ju dërgoj adresën ose lokacionin tim te saktë sapo t'ju shkruaj me poshtë.)\n`
        : `\n(Note: I will provide my exact delivery address once we connect below.)\n`;
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div id="cart-drawer-layer" className="flex flex-col h-full bg-white border-l border-[#DCE3EB]">
      {/* Title block */}
      <div id="cart-header-row" className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#E07A2E]" />
          <h4 className="font-extrabold text-slate-900 text-lg tracking-tight">
            {t.cart}
          </h4>
          <span className="bg-[#E07A2E] text-white text-xs font-bold px-2 py-0.5 rounded-full font-mono">
            {cartItems.length}
          </span>
        </div>
        <button
          id="close-cart-btn"
          onClick={onClose}
          className="p-1 px-2.5 py-1.5 rounded-lg border hover:bg-slate-100 text-slate-500 font-bold transition-all text-sm cursor-pointer"
        >
          {lang === 'sq' ? 'Kthehu' : 'Close'}
        </button>
      </div>

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        <div id="empty-cart-state" className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="p-4 rounded-full bg-[#FCF9F2] text-slate-400">
            <ShoppingBag className="w-12 h-12 text-[#FCD581]" />
          </div>
          <p className="text-slate-600 font-medium font-sans">
            {t.emptyCart}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden justify-between">
          {/* Scrollable list items */}
          <div id="cart-items-scroller" className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.map((item) => {
              const itemPrice = item.menuItem.isByKg
                ? item.menuItem.price * (item.weightKg || 1.0)
                : item.menuItem.price * item.quantity;

              return (
                <div
                  key={item.menuItem.id}
                  className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {lang === 'sq' ? item.menuItem.nameSq : item.menuItem.nameEn}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {item.menuItem.isByKg 
                        ? `${item.menuItem.price} ALL / KG`
                        : `${item.menuItem.price} ALL`}
                    </p>

                    {/* Interactive weight/quantity adjust bars */}
                    {item.menuItem.isByKg ? (
                      <div className="flex items-center gap-1.5 mt-2 bg-white rounded-lg border border-slate-200 p-0.5 max-w-[130px] justify-between">
                        <button
                          type="button"
                          onClick={() => onUpdateWeight(item.menuItem.id, (item.weightKg || 1.0) - 0.25)}
                          className="px-2 py-0.5 hover:bg-slate-100 font-mono text-sm font-bold text-slate-600"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-800">
                          {(item.weightKg || 1.0).toFixed(2)} {t.kg}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateWeight(item.menuItem.id, (item.weightKg || 1.0) + 0.25)}
                          className="px-2 py-0.5 hover:bg-slate-100 font-mono text-sm font-bold text-slate-600"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2 bg-white rounded-lg border border-slate-200 p-0.5 max-w-[100px] justify-between">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.menuItem.id, -1)}
                          className="px-2 py-0.5 hover:bg-slate-100 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.menuItem.id, 1)}
                          className="px-2 py-0.5 hover:bg-slate-100 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-right flex flex-col justify-between items-end h-full gap-2 pl-2">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.menuItem.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">
                      {Math.round(itemPrice)} ALL
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout coordination box with GPS request */}
          <div id="cart-footer" className="p-4 border-t border-slate-200 bg-slate-50 space-y-4">
            {/* Geolocation Section */}
            <div className="bg-white border rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E07A2E]" />
                  {lang === 'sq' ? 'Lokacioni i Dërgimit' : 'GPS Delivery Coordinates'}
                </span>
                
                {gpsCoords && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Check className="w-3 h-3" />
                    {lang === 'sq' ? 'U shtua' : 'Latitude Attached'}
                  </span>
                )}
              </div>

              {!gpsCoords ? (
                <button
                  type="button"
                  id="gps-tracker-btn"
                  onClick={handleRequestGps}
                  disabled={gpsLoading}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    gpsLoading
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-orange-50 border-orange-100 hover:bg-orange-100 text-[#E07A2E]'
                  }`}
                >
                  <MapPin className="w-4 h-4 animate-bounce" />
                  <span>{gpsLoading ? t.deliveryLocationRequest : t.getCoordinatesButton}</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 flex items-center justify-between">
                  <span>
                    Lat: {gpsCoords.lat.toFixed(5)}, Lon: {gpsCoords.lon.toFixed(5)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGpsCoords(null)}
                    className="text-red-500 font-bold text-xs"
                  >
                    {lang === 'sq' ? 'Fshi' : 'Reset'}
                  </button>
                </div>
              )}

              {gpsError && (
                <div className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{gpsError}</span>
                </div>
              )}

              {/* Address Manual text Box */}
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder={lang === 'sq' ? 'Shkruani lagjen / pallatin (opsionale)' : 'Type neighborhood / building / floor (optional)'}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E07A2E] text-slate-900 bg-neutral-50/50"
              />
            </div>

            {/* Total Price display row */}
            <div className="flex items-center justify-between font-sans">
              <span className="font-bold text-slate-800 text-sm">
                {t.total}:
              </span>
              <span className="font-extrabold text-slate-900 text-xl font-mono">
                {orderTotal} ALL
              </span>
            </div>

            {/* Direct Checkout via WhatsApp */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-[#799F64] hover:bg-[#688a54] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.094-3.483l.411.244c1.61.956 3.47 1.461 5.4 1.462 5.561 0 10.086-4.519 10.089-10.081.002-2.693-1.04-5.228-2.937-7.127-1.897-1.898-4.425-2.943-7.124-2.944-5.567 0-10.096 4.522-10.1 10.086-.001 2.03.526 4.017 1.524 5.786l.267.473-.993 3.633 3.719-.974zm11.127-4.57c-.247-.124-1.463-.722-1.692-.804s-.395-.124-.562.124-.648.804-.797.973-.298.188-.545.064c-.247-.124-1.044-.384-1.988-1.223-.734-.655-1.23-1.465-1.373-1.712-.143-.246-.015-.38.11-.504.112-.11.247-.29.37-.435s.165-.247.247-.412c.083-.165.042-.31-.02-.434s-.562-1.353-.77-1.854c-.201-.483-.404-.417-.562-.424l-.479-.01c-.165 0-.433.061-.659.31-.227.247-.866.845-.866 2.06s.886 2.394.981 2.536c.095.14 1.743 2.662 4.223 3.731.59.255 1.05.408 1.41.523.593.188 1.134.161 1.56.097.475-.071 1.463-.598 1.668-1.176s.205-1.074.143-1.176c-.062-.103-.227-.165-.474-.29z" strokeWidth="0"></path>
              </svg>
              <span>{t.orderOnWhatsapp}</span>
            </button>
            
            <p className="text-[10px] text-center text-slate-400 italic">
              {t.whatsAppSubtitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
