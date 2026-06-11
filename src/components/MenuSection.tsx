/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingBag, Star, Weight, Layers } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language, MenuItem, MenuCategory } from '../types';
import { MENU_ITEMS } from '../data';

interface MenuSectionProps {
  lang: Language;
  onAddToCart: (item: MenuItem, quantity: number, weightKg?: number) => void;
}

export default function MenuSection({ lang, onAddToCart }: MenuSectionProps) {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  
  // Track selected weights individually for KG custom items (e.g. key = menuItem.id)
  const [itemWeights, setItemWeights] = useState<Record<string, number>>({
    'zgr_pule_zgare': 1.0, // default whole chicken: 1 KG
  });

  const categoriesList: { value: MenuCategory | 'all'; label: string }[] = [
    { value: 'all', label: t.allCategories },
    { value: 'mengjesi', label: t.categories.mengjesi },
    { value: 'mengjesi_anglez', label: t.categories.mengjesi_anglez },
    { value: 'tava_familjare', label: t.categories.tava_familjare },
    { value: 'pasta_rizoto', label: t.categories.pasta_rizoto },
    { value: 'gjelle_ndryshme', label: t.categories.gjelle_ndryshme },
    { value: 'supa', label: t.categories.supa },
    { value: 'shoqeruese', label: t.categories.shoqeruese },
    { value: 'sallata', label: t.categories.sallata },
    { value: 'tava_tradicionale', label: t.categories.tava_tradicionale },
    { value: 'zgare', label: t.categories.zgare },
  ];

  const filteredItems = selectedCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  const handleWeightChange = (itemId: string, increment: boolean) => {
    const current = itemWeights[itemId] || 1.0;
    let next = increment ? current + 0.25 : current - 0.25;
    if (next < 0.25) next = 0.25; // minimum 0.25 KG
    setItemWeights({
      ...itemWeights,
      [itemId]: next
    });
  };

  const triggerAddToCart = (item: MenuItem) => {
    if (item.isByKg) {
      const weight = itemWeights[item.id] || 1.0;
      onAddToCart(item, 1, weight);
    } else {
      onAddToCart(item, 1);
    }
  };

  return (
    <div id="interactive-menu-container" className="space-y-8 animate-fadeIn">
      {/* Category Pills Scroller */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
          <Layers className="w-4 h-4 text-[#E07A2E]" />
          <span>{lang === 'sq' ? 'Kategoritë e ushqimit' : 'Dish Categories'}</span>
        </div>
        
        <div 
          id="menu-categories-scroller" 
          className="flex whitespace-nowrap overflow-x-auto gap-2 pb-3 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categoriesList.map((cat) => (
            <button
              key={cat.value}
              id={`category-btn-${cat.value}`}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold tracking-tight uppercase transition-all flex-shrink-0 cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-[#E07A2E] text-white shadow-md'
                  : 'bg-[#FCF9F2] hover:bg-[#FCD581]/35 border border-[#DCE3EB] text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Bento List */}
      <div 
        id="menu-items-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item) => {
          const isKg = !!item.isByKg;
          const currentWeight = itemWeights[item.id] || 1.0;
          const calculatedPrice = isKg ? Math.round(item.price * currentWeight) : item.price;

          return (
            <div
              key={item.id}
              id={`dish-card-${item.id}`}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-auto"
            >
              {/* Product Visual Container */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-50">
                <img
                  src={item.image}
                  alt={lang === 'sq' ? item.nameSq : item.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl font-mono font-extrabold text-[#E07A2E] text-sm shadow-sm flex items-center justify-center border border-orange-100">
                  {calculatedPrice} ALL
                  {isKg && (
                    <span className="text-[10px] text-slate-400 font-sans font-normal ml-0.5">
                      / {currentWeight.toFixed(2)} {t.kg}
                    </span>
                  )}
                </div>
              </div>

              {/* Specs & Description box */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#799F64]">
                      {t.categories[item.category] || item.category}
                    </span>
                    {/* Add visual flair */}
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-[#FCD581] fill-[#FCD581]" />
                      <span className="text-[10px] font-bold text-slate-400 font-mono">4.8</span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                    {lang === 'sq' ? item.nameSq : item.nameEn}
                  </h4>

                  <p className="text-slate-500 text-xs sm:text-sm font-sans font-normal line-clamp-2 md:line-clamp-3">
                    {lang === 'sq' ? item.descriptionSq : item.descriptionEn}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-50 text-xs text-slate-600">
                  {/* Weight Selector toggles (ONLY for isByKg items like Pule Zgare) */}
                  {isKg && (
                    <div className="bg-[#FCF9F2] border border-[#FCD581]/50 p-2.5 rounded-xl space-y-1.5 animate-fadeIn">
                      <div className="flex items-center gap-1.5 font-bold font-sans text-[11px] text-slate-700">
                        <Weight className="w-3.5 h-3.5 text-[#E07A2E]" />
                        <span>{t.howManyKg}</span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg overflow-hidden p-0.5">
                        <button
                          type="button"
                          onClick={() => handleWeightChange(item.id, false)}
                          className="px-3 py-1 hover:bg-slate-100 font-mono font-bold text-lg text-slate-600 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          {currentWeight.toFixed(2)} {t.kg}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleWeightChange(item.id, true)}
                          className="px-3 py-1 hover:bg-slate-100 font-mono font-bold text-lg text-slate-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-[9px] text-[#E07A2E] text-center font-mono italic">
                        {item.price} {t.pricePerKg}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Action */}
                  <button
                    id={`add-to-cart-btn-${item.id}`}
                    onClick={() => triggerAddToCart(item)}
                    className="w-full py-3 px-4 rounded-xl font-bold bg-[#FCD581] hover:bg-[#ebbe5c] text-slate-900 hover:text-black shadow-sm transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-800" />
                    <span>{t.addToCart}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
