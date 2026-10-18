import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Trash2, Maximize2, User, Sparkles } from 'lucide-react';
import FrameRenderer from './FrameRenderer';
import { formatDateIndo, getDaysAgo } from '../utils/dateFormatter';
import confetti from 'canvas-confetti';

// 6 Variasi scrapbook acak-teratur agar posisi foto "bebas & gak rata"
const SCRAPBOOK_VARIATIONS = [
  {
    // Item 0: Foto miring kiri, agak naik; Teks miring kanan, agak turun
    photoTilt: '-rotate-2 sm:-rotate-3 md:-rotate-4',
    photoOffset: 'md:-translate-y-6',
    photoXOffset: 'md:-translate-x-2',
    photoTapeStyle: 'washi-tape-pink',
    photoTapePos: '-top-3.5 left-10 -rotate-2',
    photoTapeText: '♥ SWEET MOMENT ♥',
    photoSticker: '🌸',
    photoStickerPos: '-bottom-1.5 -left-1.5 sm:-bottom-3 sm:-left-3',
    cardTilt: 'rotate-1 sm:rotate-2 md:rotate-2',
    cardOffset: 'md:translate-y-5',
    cardXOffset: 'md:translate-x-2',
    cardTapeStyle: 'washi-tape-peach',
    cardTapePos: '-top-3.5 right-10 rotate-2',
    cardTapeText: '★ NOTE ★',
    cardPin: '📌',
    cardPinPos: '-top-3 left-6',
  },
  {
    // Item 1: Teks miring kiri, agak naik; Foto miring kanan, agak turun
    photoTilt: 'rotate-2 sm:rotate-3 md:rotate-4',
    photoOffset: 'md:translate-y-6',
    photoXOffset: 'md:translate-x-3',
    photoTapeStyle: 'washi-tape-lavender',
    photoTapePos: '-top-3.5 right-8 rotate-3',
    photoTapeText: '★ OUR STORY ★',
    photoSticker: '✨',
    photoStickerPos: '-top-1.5 -left-1.5 sm:-bottom-3 sm:-right-3',
    cardTilt: '-rotate-1 sm:-rotate-2 md:-rotate-2',
    cardOffset: 'md:-translate-y-5',
    cardXOffset: 'md:-translate-x-2',
    cardTapeStyle: 'washi-tape-pink',
    cardTapePos: '-top-3.5 left-10 -rotate-1',
    cardTapeText: '♥ MEMORY ♥',
    cardPin: '📎',
    cardPinPos: '-top-3 right-6',
  },
  {
    // Item 2: Foto miring kiri lembut, agak turun; Teks miring kanan lembut
    photoTilt: '-rotate-1 sm:-rotate-2 md:-rotate-3',
    photoOffset: 'md:translate-y-4',
    photoXOffset: 'md:-translate-x-1',
    photoTapeStyle: 'washi-tape-mint',
    photoTapePos: '-top-3.5 left-12 -rotate-1',
    photoTapeText: '🌸 BEAUTIFUL 🌸',
    photoSticker: '💖',
    photoStickerPos: '-top-1.5 -left-1.5 sm:-top-3 sm:-right-3',
    cardTilt: 'rotate-1 sm:rotate-1.5 md:rotate-2',
    cardOffset: 'md:-translate-y-4',
    cardXOffset: 'md:translate-x-2',
    cardTapeStyle: 'washi-tape-lavender',
    cardTapePos: '-top-3.5 right-8 rotate-3',
    cardTapeText: '★ SPECIAL ★',
    cardPin: '🌸',
    cardPinPos: '-top-3 left-8',
  },
  {
    // Item 3: Teks miring kanan, agak turun; Foto miring kanan tegas, agak naik
    photoTilt: 'rotate-3 sm:rotate-4 md:rotate-5',
    photoOffset: 'md:-translate-y-7',
    photoXOffset: 'md:translate-x-4',
    photoTapeStyle: 'washi-tape-peach',
    photoTapePos: '-top-3.5 right-10 rotate-2',
    photoTapeText: '🍓 SWEET TIME 🍓',
    photoSticker: '🍓',
    photoStickerPos: '-bottom-1.5 -left-1.5 sm:-bottom-3 sm:-left-3',
    cardTilt: '-rotate-1.5 sm:-rotate-2 md:-rotate-2.5',
    cardOffset: 'md:translate-y-6',
    cardXOffset: 'md:-translate-x-2',
    cardTapeStyle: 'washi-tape-pink',
    cardTapePos: '-top-3.5 left-8 -rotate-2',
    cardTapeText: '♥ FOREVER ♥',
    cardPin: '🎀',
    cardPinPos: '-top-3 right-8',
  },
  {
    // Item 4: Foto miring kiri, agak turun; Teks miring kanan, agak naik
    photoTilt: '-rotate-2 sm:-rotate-3 md:-rotate-3.5',
    photoOffset: 'md:translate-y-5',
    photoXOffset: 'md:-translate-x-3',
    photoTapeStyle: 'washi-tape-lavender',
    photoTapePos: '-top-3.5 left-8 -rotate-3',
    photoTapeText: '🧸 HAPPY DAYS 🧸',
    photoSticker: '🧸',
    photoStickerPos: '-top-1.5 -left-1.5 sm:-top-3 sm:-left-3',
    cardTilt: 'rotate-1 sm:rotate-2 md:rotate-2',
    cardOffset: 'md:-translate-y-3',
    cardXOffset: 'md:translate-x-3',
    cardTapeStyle: 'washi-tape-mint',
    cardTapePos: '-top-3.5 right-12 rotate-1',
    cardTapeText: '★ PRECIOUS ★',
    cardPin: '📌',
    cardPinPos: '-top-3 left-6',
  },
  {
    // Item 5: Teks miring kiri lembut; Foto miring kanan, agak naik
    photoTilt: 'rotate-2 sm:rotate-3 md:rotate-3.5',
    photoOffset: 'md:-translate-y-5',
    photoXOffset: 'md:translate-x-2',
    photoTapeStyle: 'washi-tape-pink',
    photoTapePos: '-top-3.5 right-10 rotate-2',
    photoTapeText: '✨ MAGIC MOMENT ✨',
    photoSticker: '🌷',
    photoStickerPos: '-bottom-1.5 -left-1.5 sm:-bottom-3 sm:-right-3',
    cardTilt: '-rotate-1 sm:-rotate-1.5 md:-rotate-2',
    cardOffset: 'md:translate-y-4',
    cardXOffset: 'md:-translate-x-2',
    cardTapeStyle: 'washi-tape-peach',
    cardTapePos: '-top-3.5 left-10 -rotate-2',
    cardTapeText: '♥ SMILE ♥',
    cardPin: '📎',
    cardPinPos: '-top-3 right-6',
  },
];

// Helper fungsi untuk menyimpan & membaca memori yang sudah disukai user di browser ini
const getLikedMemoriesFromStorage = () => {
  try {
    const raw = localStorage.getItem('sweet_moments_liked_ids');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const saveLikedMemoriesToStorage = (ids) => {
  try {
    localStorage.setItem('sweet_moments_liked_ids', JSON.stringify(ids));
  } catch (err) {}
};

export default function TimelineItem({
  memory,
  index,
  onLike,
  onDelete,
  onSelectPhoto,
  themeConfig,
}) {
  const isDark = Boolean(themeConfig?.isDark);

  // Cek apakah user di browser ini sudah pernah memberi like untuk memori ini
  const [liked, setLiked] = useState(() => {
    const likedIds = getLikedMemoriesFromStorage();
    return likedIds.includes(memory.id);
  });
  const [likeCount, setLikeCount] = useState(memory.likes || 0);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sinkronisasi like count jika props memory.likes berubah
  useEffect(() => {
    setLikeCount(memory.likes || 0);
  }, [memory.likes]);

  // isEven: true (Index 0, 2, 4...) -> FOTO di Kiri, TEKS di Kanan
  // isEven: false (Index 1, 3, 5...) -> TEKS di Kiri, FOTO di Kanan
  const isEven = index % 2 === 0;
  const dateInfo = formatDateIndo(memory.date);
  const relativeDate = getDaysAgo(memory.date);

  // Variasi scrapbook untuk posisi bebas & tidak kaku
  const variation = SCRAPBOOK_VARIATIONS[index % SCRAPBOOK_VARIATIONS.length];

  // Alternating card pastel color palettes
  const lightColorThemes = [
    {
      bg: 'bg-rose-50/90 hover:bg-rose-50',
      border: 'border-rose-200/80',
      tag: 'bg-rose-100 text-rose-700',
      accent: 'text-rose-600',
      title: 'text-slate-800 group-hover:text-pink-600',
      noteBox: 'bg-white/80 border-pink-100/70 text-slate-700',
      authorBox: 'bg-white/70 border-pink-100 text-slate-600',
      divider: 'border-pink-100/80',
      likeBtnLiked: 'bg-pink-500 text-white shadow-pink-300/50',
      likeBtnUnliked: 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-50',
      actionBtn: 'bg-white/90 hover:bg-white text-slate-500 hover:text-pink-500 border border-pink-100',
    },
    {
      bg: 'bg-purple-50/90 hover:bg-purple-50',
      border: 'border-purple-200/80',
      tag: 'bg-purple-100 text-purple-700',
      accent: 'text-purple-600',
      title: 'text-slate-800 group-hover:text-purple-600',
      noteBox: 'bg-white/80 border-purple-100/70 text-slate-700',
      authorBox: 'bg-white/70 border-purple-100 text-slate-600',
      divider: 'border-purple-100/80',
      likeBtnLiked: 'bg-purple-500 text-white shadow-purple-300/50',
      likeBtnUnliked: 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50',
      actionBtn: 'bg-white/90 hover:bg-white text-slate-500 hover:text-purple-500 border border-purple-100',
    },
    {
      bg: 'bg-amber-50/90 hover:bg-amber-50',
      border: 'border-amber-200/80',
      tag: 'bg-amber-100 text-amber-700',
      accent: 'text-amber-600',
      title: 'text-slate-800 group-hover:text-amber-600',
      noteBox: 'bg-white/80 border-amber-100/70 text-slate-700',
      authorBox: 'bg-white/70 border-amber-100 text-slate-600',
      divider: 'border-amber-100/80',
      likeBtnLiked: 'bg-amber-500 text-white shadow-amber-300/50',
      likeBtnUnliked: 'bg-white text-amber-600 border border-amber-200 hover:bg-amber-50',
      actionBtn: 'bg-white/90 hover:bg-white text-slate-500 hover:text-amber-500 border border-amber-100',
    },
    {
      bg: 'bg-teal-50/90 hover:bg-teal-50',
      border: 'border-teal-200/80',
      tag: 'bg-teal-100 text-teal-700',
      accent: 'text-teal-600',
      title: 'text-slate-800 group-hover:text-teal-600',
      noteBox: 'bg-white/80 border-teal-100/70 text-slate-700',
      authorBox: 'bg-white/70 border-teal-100 text-slate-600',
      divider: 'border-teal-100/80',
      likeBtnLiked: 'bg-teal-500 text-white shadow-teal-300/50',
      likeBtnUnliked: 'bg-white text-teal-600 border border-teal-200 hover:bg-teal-50',
      actionBtn: 'bg-white/90 hover:bg-white text-slate-500 hover:text-teal-500 border border-teal-100',
    },
  ];

  const darkColorThemes = [
    {
      bg: 'bg-slate-900/95 hover:bg-slate-800',
      border: 'border-purple-500/40',
      tag: 'bg-purple-950/80 text-purple-300 border border-purple-500/30',
      accent: 'text-purple-400',
      title: 'text-slate-100 group-hover:text-purple-300',
      noteBox: 'bg-slate-800/90 border-slate-700/80 text-slate-200',
      authorBox: 'bg-slate-800/80 border-slate-700 text-slate-300',
      divider: 'border-slate-800',
      likeBtnLiked: 'bg-purple-600 text-white shadow-purple-500/40',
      likeBtnUnliked: 'bg-slate-800 text-purple-300 border border-purple-500/30 hover:bg-slate-700',
      actionBtn: 'bg-slate-800 text-slate-300 hover:text-purple-300 border border-slate-700',
    },
    {
      bg: 'bg-slate-900/95 hover:bg-slate-800',
      border: 'border-indigo-500/40',
      tag: 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30',
      accent: 'text-indigo-400',
      title: 'text-slate-100 group-hover:text-indigo-300',
      noteBox: 'bg-slate-800/90 border-slate-700/80 text-slate-200',
      authorBox: 'bg-slate-800/80 border-slate-700 text-slate-300',
      divider: 'border-slate-800',
      likeBtnLiked: 'bg-indigo-600 text-white shadow-indigo-500/40',
      likeBtnUnliked: 'bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:bg-slate-700',
      actionBtn: 'bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-700',
    },
    {
      bg: 'bg-slate-900/95 hover:bg-slate-850',
      border: 'border-pink-500/40',
      tag: 'bg-pink-950/80 text-pink-300 border border-pink-500/30',
      accent: 'text-pink-400',
      title: 'text-slate-100 group-hover:text-pink-300',
      noteBox: 'bg-slate-800/90 border-slate-700/80 text-slate-200',
      authorBox: 'bg-slate-800/80 border-slate-700 text-slate-300',
      divider: 'border-slate-800',
      likeBtnLiked: 'bg-pink-600 text-white shadow-pink-500/40',
      likeBtnUnliked: 'bg-slate-800 text-pink-300 border border-pink-500/30 hover:bg-slate-700',
      actionBtn: 'bg-slate-800 text-slate-300 hover:text-pink-300 border border-slate-700',
    },
  ];

  const palette = isDark ? darkColorThemes : lightColorThemes;
  const theme = palette[index % palette.length];

  const handleLikeClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const likedIds = getLikedMemoriesFromStorage();
    const isCurrentlyLiked = likedIds.includes(memory.id);

    if (isCurrentlyLiked) {
      // BATAL LIKE (Unlike) - kurangi 1 like dan hapus dari storage
      const updatedIds = likedIds.filter((id) => id !== memory.id);
      saveLikedMemoriesToStorage(updatedIds);
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));

      if (onLike) {
        onLike(memory.id, 'unlike');
      }
    } else {
      // BERI LIKE - tambah 1 like dan simpan ke storage
      const updatedIds = [...likedIds, memory.id];
      saveLikedMemoriesToStorage(updatedIds);
      setLiked(true);
      setLikeCount((prev) => prev + 1);

      // Spawn animasi floating heart
      const heartId = Date.now() + Math.random();
      setFloatingHearts((prev) => [...prev, heartId]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((id) => id !== heartId));
      }, 1500);

      // Mini confetti burst
      if (e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 16,
          spread: 60,
          origin: { x, y },
          colors: ['#f472b6', '#fb7185', '#fda4af', '#fecdd3'],
          shapes: ['circle'],
          scalar: 0.8,
        });
      }

      if (onLike) {
        onLike(memory.id, 'like');
      }
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Hapus kenangan "${memory.title || 'ini'}"? 🥺`)) {
      setIsDeleting(true);
      onDelete(memory.id);
    }
  };

  return (
    <div
      className={`relative w-full transition-opacity duration-300 ${
        isDeleting ? 'opacity-30 scale-95' : 'opacity-100'
      }`}
    >
      {/* Central Heart Pin & Milestone Marker (Tampil baik di HP maupun Laptop) */}
      <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center pointer-events-none">
        {/* Garis putus-putus pendek manis */}
        <div
          className={`absolute top-[14px] sm:top-[18px] md:top-[22px] -left-2 sm:-left-4 md:-left-6 w-2 sm:w-4 md:w-6 border-t sm:border-t-2 border-dashed pointer-events-none ${
            isDark ? 'border-purple-400/50' : 'border-pink-300/80'
          }`}
        />
        <div
          className={`absolute top-[14px] sm:top-[18px] md:top-[22px] -right-2 sm:-right-4 md:-right-6 w-2 sm:w-4 md:w-6 border-t sm:border-t-2 border-dashed pointer-events-none ${
            isDark ? 'border-purple-400/50' : 'border-pink-300/80'
          }`}
        />

        <button
          onClick={handleLikeClick}
          title="Beri Cinta"
          className={`w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full border sm:border-2 flex items-center justify-center text-[10px] sm:text-base md:text-lg transition-transform hover:scale-125 active:scale-95 group pointer-events-auto ${
            isDark
              ? 'bg-slate-900 border-purple-500/50 shadow-purple-950/50'
              : 'bg-white shadow-xs sm:shadow-lg shadow-pink-300/50 border-pink-300'
          }`}
        >
          <span className="transform group-hover:scale-110 transition-transform">
            {liked ? '💖' : '🤍'}
          </span>
        </button>

        <span
          className={`text-[7px] sm:text-[9px] md:text-[10px] font-cute font-bold mt-0.5 px-1 sm:px-2 py-0.2 rounded-full shadow-2xs border pointer-events-auto ${
            isDark
              ? 'text-purple-300 bg-slate-900/95 border-purple-500/40'
              : 'text-pink-600 bg-white/95 border-pink-200'
          }`}
        >
          #{index + 1}
        </span>
      </div>

      {/* Grid: Selalu 2 Kolom Sebelah-Sebelahan Selang-Seling dengan Ruang Bernafas di Tengah */}
      <div className="grid grid-cols-2 gap-2 sm:gap-6 md:gap-14 lg:gap-20 items-center">
        {isEven ? (
          <>
            {/* ITEM GENAP (0, 2, 4...) */}
            {/* KIRI: FOTO */}
            <div className="flex justify-center md:justify-end items-center pr-2 sm:pr-6 md:pr-10 lg:pr-14">
              <PhotoCard
                memory={memory}
                dateInfo={dateInfo}
                variation={variation}
                onSelectPhoto={onSelectPhoto}
              />
            </div>

            {/* KANAN: TEKS KETERANGAN */}
            <div className="flex justify-center md:justify-start items-center pl-2 sm:pl-6 md:pl-10 lg:pl-14">
              <StoryCard
                memory={memory}
                dateInfo={dateInfo}
                relativeDate={relativeDate}
                theme={theme}
                variation={variation}
                likeCount={likeCount}
                liked={liked}
                floatingHearts={floatingHearts}
                handleLikeClick={handleLikeClick}
                handleDeleteClick={handleDeleteClick}
                onSelectPhoto={onSelectPhoto}
                isDark={isDark}
              />
            </div>
          </>
        ) : (
          <>
            {/* ITEM GANJIL (1, 3, 5...) */}
            {/* KIRI: TEKS KETERANGAN */}
            <div className="flex justify-center md:justify-end items-center pr-2 sm:pr-6 md:pr-10 lg:pr-14">
              <StoryCard
                memory={memory}
                dateInfo={dateInfo}
                relativeDate={relativeDate}
                theme={theme}
                variation={variation}
                likeCount={likeCount}
                liked={liked}
                floatingHearts={floatingHearts}
                handleLikeClick={handleLikeClick}
                handleDeleteClick={handleDeleteClick}
                onSelectPhoto={onSelectPhoto}
                isDark={isDark}
              />
            </div>

            {/* KANAN: FOTO */}
            <div className="flex justify-center md:justify-start items-center pl-2 sm:pl-6 md:pl-10 lg:pl-14">
              <PhotoCard
                memory={memory}
                dateInfo={dateInfo}
                variation={variation}
                onSelectPhoto={onSelectPhoto}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Sub-component: Photo Card dengan Kemiringan Organik Scrapbook Bebas
function PhotoCard({ memory, dateInfo, variation, onSelectPhoto }) {
  return (
    <div
      className={`relative w-full max-w-[145px] min-[390px]:max-w-[155px] min-[420px]:max-w-[170px] sm:max-w-[340px] md:max-w-[395px] transform transition-all duration-500 ease-out ${variation.photoTilt} ${variation.photoOffset} ${variation.photoXOffset} hover:rotate-0 hover:scale-[1.03] hover:z-30 cursor-pointer group`}
      onClick={() => onSelectPhoto(memory)}
    >
      {/* Scrapbook Washi Tape dekoratif di atas foto */}
      <div
        className={`absolute ${variation.photoTapePos} w-11 sm:w-22 md:w-28 h-3 sm:h-5 md:h-6 ${variation.photoTapeStyle} rounded-xs opacity-90 z-20 shadow-xs flex items-center justify-center pointer-events-none`}
      >
        <span className="text-[5.5px] sm:text-[8px] md:text-[9px] text-pink-700/80 font-mono tracking-widest font-bold">
          {variation.photoTapeText}
        </span>
      </div>

      {/* Stiker lucu di sudut foto */}
      <span
        className={`absolute ${variation.photoStickerPos} text-[10px] sm:text-lg md:text-2xl select-none z-20 filter drop-shadow transform hover:scale-125 transition-transform pointer-events-none`}
      >
        {variation.photoSticker}
      </span>

      {/* Frame Renderer */}
      <FrameRenderer
        imageUrl={memory.imageUrl}
        title={memory.title}
        date={dateInfo.fullDate}
        frame={memory.frame}
        stickers={memory.stickers}
        aspectRatio={memory.aspectRatio || '4:3'}
        onClick={() => onSelectPhoto(memory)}
      />
    </div>
  );
}

// Sub-component: Scrapbook Story Note Card (Responsif, Proporsional & Rapi di HP)
function StoryCard({
  memory,
  dateInfo,
  relativeDate,
  theme,
  variation,
  likeCount,
  liked,
  floatingHearts,
  handleLikeClick,
  handleDeleteClick,
  onSelectPhoto,
  isDark,
}) {
  return (
    <div
      className={`relative w-full max-w-[145px] min-[390px]:max-w-[155px] min-[420px]:max-w-[170px] sm:max-w-[340px] md:max-w-[395px] p-1.5 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl ${theme.bg} border sm:border-2 ${theme.border} ${
        isDark ? 'shadow-purple-950/40 text-slate-100' : 'shadow-pink-100/70 text-slate-800'
      } backdrop-blur-xs transition-all duration-500 ease-out transform ${variation.cardTilt} ${variation.cardOffset} ${variation.cardXOffset} hover:rotate-0 hover:scale-[1.01] hover:shadow-2xl group`}
    >
      {/* Washi Tape di atas Card */}
      <div
        className={`absolute ${variation.cardTapePos} w-10 sm:w-18 md:w-24 h-2.5 sm:h-4.5 md:h-5 ${variation.cardTapeStyle} rounded-xs opacity-85 z-10 shadow-xs flex items-center justify-center pointer-events-none`}
      >
        <span className="text-[5.5px] sm:text-[8px] md:text-[9px] text-pink-700/75 font-mono tracking-wider font-semibold">
          {variation.cardTapeText}
        </span>
      </div>

      {/* Push Pin / Paper Clip dekoratif */}
      <span
        className={`absolute ${variation.cardPinPos} text-[10px] sm:text-base md:text-xl select-none z-20 filter drop-shadow pointer-events-none`}
      >
        {variation.cardPin}
      </span>

      {/* Top Meta Bar: Date Badge + Mood */}
      <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2 pt-0.5">
        {/* Date Pill */}
        <div
          className="inline-flex items-center gap-0.5 px-1 sm:px-2.5 md:px-3 py-0.2 sm:py-0.5 rounded-full text-white text-[6.5px] sm:text-[10px] md:text-xs font-cute font-bold shadow-xs shrink-0"
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(to right, #6366f1, #a855f7)'
              : 'linear-gradient(to right, #ec4899, #f43f5e)',
          }}
        >
          <Calendar className="w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
          <span className="line-clamp-1">{dateInfo.formatted || memory.date}</span>
        </div>

        {/* Relative time */}
        <span
          className={`text-[6.5px] sm:text-[9px] md:text-[11px] font-cute hidden sm:flex items-center gap-1 shrink-0 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <Clock className={`w-2 h-2 sm:w-3 sm:h-3 ${isDark ? 'text-purple-400' : 'text-pink-400'}`} />
          {relativeDate}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`text-[10px] sm:text-base md:text-2xl font-bold tracking-tight font-cute mb-1 leading-tight transition-colors line-clamp-1 sm:line-clamp-2 ${theme.title}`}
      >
        {memory.title || 'Momen Indah'}
      </h3>

      {/* Handwritten Description with Soft Paper Note Box */}
      <div
        className={`p-1 sm:p-2.5 md:p-3.5 rounded-md sm:rounded-xl md:rounded-2xl shadow-2xs mb-1 sm:mb-3 border ${theme.noteBox}`}
      >
        <p className="font-handwriting text-[8.5px] sm:text-sm md:text-xl leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
          "{memory.description || 'Setiap detik bersamamu adalah kenangan manis.'}"
        </p>
      </div>

      {/* Bottom Meta & Actions */}
      <div className={`flex items-center justify-between pt-1 sm:pt-2 border-t gap-0.5 ${theme.divider}`}>
        {/* Author / Mood */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {memory.author && (
            <div
              className={`flex items-center gap-0.5 text-[6.5px] sm:text-[10px] md:text-xs font-cute px-1 py-0.2 rounded-full border max-w-[50px] sm:max-w-none truncate ${theme.authorBox}`}
            >
              <User className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 shrink-0 ${theme.accent}`} />
              <span className="truncate">{memory.author}</span>
            </div>
          )}
          {memory.mood && (
            <span
              className={`text-[6.5px] sm:text-[9px] md:text-xs font-cute px-1 py-0.2 rounded-full font-medium ${theme.tag} truncate hidden sm:inline-block`}
            >
              {memory.mood}
            </span>
          )}
        </div>

        {/* Interactive Buttons (Heart + Zoom + Delete) */}
        <div className="flex items-center gap-0.5 sm:gap-1 relative shrink-0">
          {/* Floating Hearts */}
          {floatingHearts.map((id) => (
            <span
              key={id}
              className="absolute -top-5 sm:-top-8 right-1 text-xs sm:text-xl pointer-events-none animate-bounce"
              style={{
                animationDuration: '1.2s',
              }}
            >
              💖
            </span>
          ))}

          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2.5 md:px-3 py-0.2 sm:py-1 rounded-full text-[7px] sm:text-[10px] md:text-xs font-cute font-bold transition-all ${
              liked
                ? `${theme.likeBtnLiked} scale-105`
                : `${theme.likeBtnUnliked} hover:scale-105`
            }`}
          >
            <Heart
              className={`w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ${
                liked ? 'fill-white text-white' : isDark ? 'text-purple-400' : 'text-pink-500'
              }`}
            />
            <span>{likeCount}</span>
          </button>

          {/* Zoom / Lightbox Button */}
          <button
            onClick={() => onSelectPhoto(memory)}
            title="Lihat Foto Penuh"
            className={`p-0.5 sm:p-1.5 rounded-full transition-colors ${theme.actionBtn}`}
          >
            <Maximize2 className="w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            title="Hapus Kenangan"
            className={`p-0.5 sm:p-1.5 rounded-full transition-colors ${theme.actionBtn}`}
          >
            <Trash2 className="w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
