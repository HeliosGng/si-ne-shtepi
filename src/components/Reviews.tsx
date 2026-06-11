/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MessageSquare, PlusCircle, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../translations';
import { Language, Review } from '../types';
import { INITIAL_REVIEWS } from '../data';

interface ReviewsProps {
  lang: Language;
}

export default function Reviews({ lang }: ReviewsProps) {
  const t = TRANSLATIONS[lang];
  const [reviewsList, setReviewsList] = useState<Review[]>(INITIAL_REVIEWS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Constants
  const totalBaseReviews = 32;
  const initialAverage = 4.8;
  const initialSum = totalBaseReviews * initialAverage; // 153.6

  // Recalculate average based on new state additions
  const addedReviews = reviewsList.length - INITIAL_REVIEWS.length;
  const newSum = initialSum + reviewsList.slice(INITIAL_REVIEWS.length).reduce((acc, curr) => acc + curr.rating, 0);
  const totalReviewCount = totalBaseReviews + addedReviews;
  const dynamicAverage = parseFloat((newSum / totalReviewCount).toFixed(1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const newReview: Review = {
      id: `rev_user_${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      timeSq: 'Sapoçmuar',
      timeEn: 'Just now',
      textSq: newText,
      textEn: newText, // Using the same text for both
      avatarColor: ['#E07A2E', '#799F64', '#FCD581', '#3B82F6', '#EC4899'][Math.floor(Math.random() * 5)],
    };

    setReviewsList([newReview, ...reviewsList]);
    setNewAuthor('');
    setNewRating(5);
    setNewText('');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowAddForm(false);
    }, 3000);
  };

  return (
    <div id="reviews-section" className="space-y-8 animate-fadeIn">
      {/* Overview Card */}
      <div id="review-overview-card" className="bg-gradient-to-br from-white to-[#FDFBF7] border border-[#DCE3EB] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-2">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{t.reviews}</p>
          <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight flex items-baseline justify-center md:justify-start gap-2">
            {dynamicAverage}
            <span className="text-lg font-medium text-slate-400">/ 5.0</span>
          </h3>
          <div className="flex items-center justify-center md:justify-start gap-1 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const fillType = star <= Math.floor(dynamicAverage) ? 'full' : (star - dynamicAverage < 1 ? 'half' : 'empty');
              return (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    fillType === 'full'
                      ? 'text-[#FCD581] fill-[#FCD581]'
                      : fillType === 'half'
                      ? 'text-[#FCD581] fill-[#FCD581] opacity-70'
                      : 'text-slate-300'
                  }`}
                />
              );
            })}
          </div>
          <p className="text-xs text-slate-500 italic font-mono">
            {t.basedOn} ({totalReviewCount} total)
          </p>
        </div>

        <button
          id="write-review-toggle-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E07A2E] hover:bg-[#c96d27] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          {t.writeReview}
        </button>
      </div>

      {/* Form modal/accordion in slate styling */}
      {showAddForm && (
        <div
          id="add-review-form"
          className="bg-[#FCF9F2] p-6 rounded-2xl border-2 border-[#FCD581] shadow-inner space-y-4 animate-slideDown"
        >
          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#E07A2E]" />
            {t.writeReview}
          </h4>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <span className="font-medium text-sm">{t.reviewFormSuccess}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{t.yourName}</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E]"
                    placeholder="e.g. John Doe / Anna"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{t.yourRating}</label>
                  <div className="flex items-center gap-2 h-11">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setNewRating(starVal)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            starVal <= newRating ? 'text-[#FCD581] fill-[#FCD581]' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{t.reviewText}</label>
                <textarea
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E07A2E]"
                  placeholder="Tell us what you loved about our traditional Albania dishes..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#799F64] hover:bg-[#688a54] text-white font-semibold shadow-md transition-colors transform active:scale-95"
              >
                {t.submitReview}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Reviews Loop list */}
      <div id="reviews-list-container" className="space-y-4">
        <h4 className="text-lg font-bold text-slate-800 border-b border-dashed border-slate-200 pb-2">
          {t.reviewsHeader}
        </h4>

        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            id={`review-item-${rev.id}`}
            className="p-5 h-auto bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-4"
          >
            {/* Avatar block with initial */}
            <div
              className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm"
              style={{ backgroundColor: rev.avatarColor }}
            >
              {rev.author.charAt(0).toUpperCase()}
            </div>

            {/* Core review bubble */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {rev.author}
                </h5>
                <span className="text-xs font-mono text-slate-400">
                  {lang === 'sq' ? rev.timeSq : rev.timeEn}
                </span>
              </div>

              {/* Stars render */}
              <div className="flex items-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-3.5 h-3.5 ${
                      starIdx <= rev.rating ? 'text-[#FCD581] fill-[#FCD581]' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Text review comment */}
              <p className="text-sm text-slate-700 leading-relaxed font-sans pt-1">
                {lang === 'sq' ? rev.textSq : rev.textEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
