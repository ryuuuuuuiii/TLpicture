import React from 'react';
import { X, Calendar, User, Heart, Sparkles, Download } from 'lucide-react';
import FrameRenderer from './FrameRenderer';
import { formatDateIndo } from '../utils/dateFormatter';

export default function PhotoLightbox({ memory, onClose, onLike, themeConfig }) {
  if (!memory) return null;

  const isDark = Boolean(themeConfig?.isDark);
  const dateInfo = formatDateIndo(memory.date);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className={`relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-2 border-purple-500/40 text-slate-100 shadow-purple-950/60'
            : 'bg-white/95 border-2 border-pink-200 text-slate-800'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* PHOTO SECTION */}
          <div className="md:col-span-7 bg-slate-900/95 flex items-center justify-center p-6 sm:p-8">
            <div className="w-full max-w-sm">
              <FrameRenderer
                imageUrl={memory.imageUrl}
                title={memory.title}
                date={dateInfo.fullDate}
                frame={memory.frame}
                stickers={memory.stickers}
                isHoverable={false}
              />
            </div>
          </div>

          {/* STORY / DETAILS SECTION */}
          <div
            className={`md:col-span-5 p-6 flex flex-col justify-between ${
              isDark
                ? 'bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-900 text-slate-100'
                : 'bg-gradient-to-b from-rose-50/50 to-pink-50/30 text-slate-800'
            }`}
          >
            <div>
              {/* Date & Mood */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-cute font-bold flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-purple-900/60 text-purple-300 border border-purple-500/30'
                      : 'bg-pink-100 text-pink-700'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {dateInfo.formatted || memory.date}
                </span>
                {memory.mood && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-cute shadow-2xs border ${
                      isDark
                        ? 'bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-white text-slate-700 border-pink-100'
                    }`}
                  >
                    {memory.mood}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2
                className={`text-2xl font-bold font-cute mb-3 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                {memory.title || 'Momen Spesial'}
              </h2>

              {/* Description */}
              <div
                className={`p-4 rounded-2xl shadow-xs mb-4 border ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                    : 'bg-white border-pink-100/70 text-slate-700'
                }`}
              >
                <p
                  className={`font-handwriting text-xl leading-relaxed whitespace-pre-line ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  "{memory.description || 'Kenangan manis yang tersimpan selamanya.'}"
                </p>
              </div>

              {/* Author */}
              {memory.author && (
                <div
                  className={`flex items-center gap-2 text-xs font-cute ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <User className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-pink-400'}`} />
                  <span>
                    Diabadikan oleh:{' '}
                    <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                      {memory.author}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div
              className={`mt-6 pt-4 border-t flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-pink-200/60'
              }`}
            >
              {(() => {
                let isLiked = false;
                try {
                  const saved = localStorage.getItem('sweet_moments_liked_ids');
                  isLiked = saved ? JSON.parse(saved).includes(memory.id) : false;
                } catch (e) {}

                const handleToggle = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  let currentIds = [];
                  try {
                    const saved = localStorage.getItem('sweet_moments_liked_ids');
                    currentIds = saved ? JSON.parse(saved) : [];
                  } catch (e) {}

                  if (isLiked) {
                    const newIds = currentIds.filter((id) => id !== memory.id);
                    localStorage.setItem('sweet_moments_liked_ids', JSON.stringify(newIds));
                    if (onLike) onLike(memory.id, 'unlike');
                  } else {
                    const newIds = [...currentIds, memory.id];
                    localStorage.setItem('sweet_moments_liked_ids', JSON.stringify(newIds));
                    if (onLike) onLike(memory.id, 'like');
                  }
                };

                return (
                  <button
                    onClick={handleToggle}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-cute font-bold transition-all shadow-md active:scale-95 ${
                      isLiked
                        ? isDark
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/40'
                          : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-300/40'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
                        : 'bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 shadow-xs'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-pink-500'}`} />
                    <span>{isLiked ? 'Tersimpan di Hati 💖' : 'Beri Cinta'} ({memory.likes || 0})</span>
                  </button>
                );
              })()}

              <a
                href={memory.imageUrl}
                target="_blank"
                rel="noreferrer"
                download
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-cute font-bold transition-colors border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-300 border-slate-700'
                    : 'bg-white hover:bg-pink-50 text-slate-600 hover:text-pink-600 border-pink-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Buka Foto Asli</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
