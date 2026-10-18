import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const FRAME_TYPES = [
  { id: 'polaroid', name: '📸 Classic Polaroid', desc: 'Gaya polaroid dengan masking tape manis' },
  { id: 'floral', name: '🌸 Romantic Floral', desc: 'Hiasan bunga mawar pastel & kelopak' },
  { id: 'filmstrip', name: '🎞️ Vintage Filmstrip', desc: 'Nuansa roll film 35mm retro aesthetic' },
  { id: 'ribbon', name: '🎀 Kawaii Ribbon', desc: 'Border merah muda dengan pita lucu' },
  { id: 'gold', name: '✨ Fairy Golden Sparkle', desc: 'Kilau emas mewah & fairy dust glow' },
  { id: 'stamp', name: '💌 Postage Stamp', desc: 'Gaya perangko pos surat cinta' },
  { id: 'glass', name: '☁️ Dream Glassmorphism', desc: 'Efek kaca lembut berbayang pastel' },
];

function getAspectStyle(aspectRatio) {
  if (!aspectRatio) return { aspectRatio: '4/3' };
  if (aspectRatio === '3:4' || aspectRatio === '3/4' || aspectRatio === 'portrait') {
    return { aspectRatio: '3/4' };
  }
  if (aspectRatio === '1:1' || aspectRatio === '1/1' || aspectRatio === 'square') {
    return { aspectRatio: '1/1' };
  }
  if (aspectRatio === '16:9' || aspectRatio === '16/9') {
    return { aspectRatio: '16/9' };
  }
  if (aspectRatio === '9:16' || aspectRatio === '9/16') {
    return { aspectRatio: '9/16' };
  }
  if (aspectRatio === '4:3' || aspectRatio === '4/3' || aspectRatio === 'landscape') {
    return { aspectRatio: '4/3' };
  }
  const parsed = parseFloat(aspectRatio);
  if (!isNaN(parsed) && parsed > 0) {
    return { aspectRatio: `${parsed}` };
  }
  return { aspectRatio: '4/3' };
}

export default function FrameRenderer({
  imageUrl,
  title,
  date,
  frame = 'polaroid',
  stickers = [],
  aspectRatio = '4:3',
  onClick,
  className = '',
  isHoverable = true,
}) {
  const aspectStyle = getAspectStyle(aspectRatio);

  return (
    <div
      onClick={onClick}
      className={`relative select-none transition-all duration-300 ${
        isHoverable ? 'hover:-translate-y-1.5 hover:rotate-0 cursor-pointer' : ''
      } ${className}`}
    >
      {/* 1. POLAROID FRAME */}
      {frame === 'polaroid' && (
        <div className="relative bg-white p-1.5 sm:p-3 pb-2.5 sm:pb-8 rounded-md sm:rounded-lg shadow-md sm:shadow-xl shadow-pink-200/50 border border-pink-100/60 transition-transform">
          {/* Cute Washi Tape at Top */}
          <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 w-14 sm:w-24 h-4 sm:h-6 washi-tape-pink transform -rotate-1 rounded-xs z-10 opacity-90 shadow-xs flex items-center justify-center">
            <span className="text-[7px] sm:text-[10px] text-pink-600/70 font-mono tracking-widest">♥ MEMORY ♥</span>
          </div>

          {/* Photo Container */}
          <div
            className="relative overflow-hidden rounded bg-slate-100 w-full group"
            style={aspectStyle}
          >
            <img
              src={imageUrl}
              alt={title || 'Memory'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Soft vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Polaroid Handwritten Caption Area */}
          <div className="mt-1 sm:mt-3 px-0.5 sm:px-1 flex items-center justify-between text-slate-700">
            <span className="font-handwriting text-[10px] sm:text-xl md:text-2xl text-slate-800 tracking-wide line-clamp-1">
              {title || 'Momen Bahagia'}
            </span>
            {date && (
              <span className="text-[6.5px] sm:text-xs font-cute text-pink-400 font-semibold shrink-0 ml-1">
                {date}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. FLORAL ROMANTIC FRAME */}
      {frame === 'floral' && (
        <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-1.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl shadow-rose-200/50 border sm:border-2 border-pink-200/80">
          {/* Floral Corner Badges (Dainty & cute on mobile) */}
          <div className="absolute -top-1 sm:-top-2.5 -left-1 sm:-left-2.5 text-[9px] sm:text-xl select-none z-10 animate-bounce" style={{ animationDuration: '3s' }}>
            🌸
          </div>
          <div className="absolute -top-1 sm:-top-2.5 -right-1 sm:-right-2.5 text-[9px] sm:text-xl select-none z-10">
            🌺
          </div>
          <div className="absolute -bottom-1 sm:-bottom-2.5 -left-1 sm:-left-2.5 text-[9px] sm:text-xl select-none z-10">
            🌷
          </div>
          <div className="absolute -bottom-1 sm:-bottom-2.5 -right-1 sm:-right-2.5 text-[9px] sm:text-xl select-none z-10">
            💐
          </div>

          <div
            className="relative overflow-hidden rounded-lg sm:rounded-xl bg-pink-100 w-full border border-pink-100 group"
            style={aspectStyle}
          >
            <img
              src={imageUrl}
              alt={title || 'Floral memory'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 border sm:border-2 border-pink-200/60 rounded-lg sm:rounded-xl pointer-events-none" />
          </div>

          <div className="mt-1 sm:mt-2.5 text-center">
            <span className="font-cute font-bold text-[8.5px] sm:text-base text-rose-700 block line-clamp-1">
              {title || 'Forever in Love'}
            </span>
          </div>
        </div>
      )}

      {/* 3. VINTAGE FILMSTRIP FRAME */}
      {frame === 'filmstrip' && (
        <div className="relative bg-slate-900 p-1.5 sm:p-3 pt-3 sm:pt-5 pb-3 sm:pb-5 rounded-md sm:rounded-lg shadow-xl shadow-slate-900/40 border border-slate-700">
          {/* Film Perforations Top */}
          <div className="absolute top-1 left-1.5 right-1.5 h-2 sm:h-3.5 flex justify-between items-center opacity-85">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 sm:w-2.5 h-1 sm:h-2 bg-slate-100/90 rounded-2xs" />
            ))}
          </div>

          {/* Film Photo */}
          <div
            className="relative overflow-hidden rounded bg-slate-800 w-full mt-0.5 sm:mt-1 group"
            style={aspectStyle}
          >
            <img
              src={imageUrl}
              alt={title || 'Film memory'}
              className="w-full h-full object-cover filter contrast-105 brightness-95 transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Film stamp code */}
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 px-1 py-0.2 bg-black/60 backdrop-blur-xs rounded text-[6px] sm:text-[9px] font-mono text-amber-300/90">
              KODAK GOLD • 24
            </div>
          </div>

          {/* Film Perforations Bottom */}
          <div className="absolute bottom-1 left-1.5 right-1.5 h-2 sm:h-3.5 flex justify-between items-center opacity-85">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-1.5 sm:w-2.5 h-1 sm:h-2 bg-slate-100/90 rounded-2xs" />
            ))}
          </div>
        </div>
      )}

      {/* 4. KAWAII RIBBON & BOW FRAME */}
      {frame === 'ribbon' && (
        <div className="relative bg-gradient-to-b from-pink-100 to-rose-100 p-1.5 sm:p-3.5 rounded-xl sm:rounded-3xl shadow-md sm:shadow-xl shadow-pink-300/40 border-2 sm:border-3 border-pink-300">
          {/* Cute Big Ribbon at Top Center */}
          <div className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 z-10 text-xs sm:text-2xl filter drop-shadow-md">
            🎀
          </div>

          {/* Photo */}
          <div
            className="relative overflow-hidden rounded-lg sm:rounded-2xl bg-white w-full group border sm:border-2 border-pink-200"
            style={aspectStyle}
          >
            <img
              src={imageUrl}
              alt={title || 'Ribbon memory'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Little heart corners */}
          <div className="flex justify-between items-center mt-1 sm:mt-2 px-1 sm:px-2 text-pink-500">
            <span className="text-[7.5px] sm:text-xs">💖</span>
            <span className="font-cute font-bold text-[7.5px] sm:text-xs text-pink-700 line-clamp-1">{title}</span>
            <span className="text-[7.5px] sm:text-xs">💖</span>
          </div>
        </div>
      )}

      {/* 5. FAIRY GOLDEN SPARKLE FRAME */}
      {frame === 'gold' && (
        <div className="relative bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100 p-1.5 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl shadow-amber-300/30 border-2 sm:border-3 border-amber-300 fairy-gold-border">
          {/* Sparkles at corners */}
          <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 text-amber-500 z-10 animate-pulse">
            <Sparkles className="w-2.5 h-2.5 sm:w-5 sm:h-5 fill-amber-300" />
          </div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 text-amber-500 z-10 animate-pulse" style={{ animationDelay: '1s' }}>
            <Sparkles className="w-2.5 h-2.5 sm:w-5 sm:h-5 fill-amber-300" />
          </div>

          <div
            className="relative overflow-hidden rounded-lg sm:rounded-xl bg-amber-50 w-full group border border-amber-200"
            style={aspectStyle}
          >
            <img
              src={imageUrl}
              alt={title || 'Golden memory'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="mt-1 sm:mt-2 text-center">
            <span className="font-cute font-bold text-[7.5px] sm:text-sm text-amber-900 line-clamp-1">
              ✨ {title || 'Golden Time'} ✨
            </span>
          </div>
        </div>
      )}

      {/* 6. POSTAGE STAMP FRAME */}
      {frame === 'stamp' && (
        <div className="relative bg-white p-1.5 sm:p-3 rounded-md shadow-md sm:shadow-xl shadow-rose-200/50 stamp-border">
          {/* Postmark stamp */}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 w-6 h-6 sm:w-12 sm:h-12 rounded-full border border-pink-400/50 flex flex-col items-center justify-center text-[4px] sm:text-[7px] font-mono text-pink-500 rotate-12 bg-white/70 backdrop-blur-xs">
            <span>LOVE POST</span>
            <span>★ ★ ★</span>
          </div>

          <div
            className="relative overflow-hidden rounded bg-pink-50 w-full group"
            style={aspectStyle}
          >
            <img
              src={imageUrl}
              alt={title || 'Stamp memory'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        </div>
      )}

      {/* 7. DREAM GLASSMORPHISM */}
      {frame === 'glass' && (
        <div className="relative bg-white/60 backdrop-blur-md p-1.5 sm:p-3.5 rounded-xl sm:rounded-3xl shadow-md sm:shadow-xl shadow-pink-200/40 border border-white/80 ring-1 ring-pink-200/50">
          <div
            className="relative overflow-hidden rounded-lg sm:rounded-2xl bg-white/40 w-full group"
            style={aspectStyle}
          >
            <img
              src={imageUrl}
              alt={title || 'Glass memory'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Iridescent shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-300/10 via-purple-300/10 to-amber-200/10 pointer-events-none" />
          </div>

          <div className="mt-1 sm:mt-2 text-center">
            <span className="font-cute font-medium text-[7.5px] sm:text-xs text-pink-600 line-clamp-1">
              ☁️ {title || 'Dream Moment'}
            </span>
          </div>
        </div>
      )}

      {/* Sticker Accents Overlay (Proporsional & Imut di HP) */}
      {stickers && stickers.length > 0 && (
        <div className="absolute -bottom-1 -right-0.5 sm:-bottom-2 sm:-right-1 flex gap-0.5 sm:gap-1 z-20 pointer-events-none filter drop-shadow">
          {stickers.map((s, idx) => (
            <span
              key={idx}
              className="text-[10px] sm:text-base md:text-xl leading-none transition-transform hover:scale-125 select-none"
              style={{
                transform: `rotate(${((idx % 3) - 1) * 12}deg)`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
