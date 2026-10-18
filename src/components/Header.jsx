import React from 'react';
import {
  Heart,
  Plus,
  Share2,
  ArrowUpDown,
  Search,
  Sparkles,
  Calendar,
  Camera,
} from 'lucide-react';
import { playPopSound } from '../utils/cuteAudio';
import { formatDateIndo } from '../utils/dateFormatter';

export default function Header({
  stats,
  sortOrder,
  onToggleSort,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenShareModal,
  themeConfig,
}) {
  const earliestDateInfo = stats?.earliestDate ? formatDateIndo(stats.earliestDate) : null;

  return (
    <header className="relative w-full pt-10 sm:pt-12 pb-6 px-4 max-w-5xl mx-auto text-center z-10">
      
      {/* Cute Floating Sparkle Accents */}
      <div className="absolute top-2 left-6 text-pink-400 animate-pulse select-none hidden sm:block">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute top-4 right-8 text-rose-400 animate-pulse select-none hidden sm:block" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-7 h-7" />
      </div>

      {/* Main Title Badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${
          themeConfig?.headerBadge || 'bg-pink-100/80 border-pink-200/80 text-pink-600'
        } border shadow-xs mb-3 animate-float`}
      >
        <span className="text-base">{themeConfig?.emoji || '🌸'}</span>
        <span className="text-xs sm:text-sm font-cute font-bold tracking-wider uppercase">
          Timeline & Album Kenangan
        </span>
        <span className="text-base">✨</span>
      </div>

      {/* Hero Heading */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-cute mb-2">
        Sweet Moments{' '}
        <span
          className={`font-romantic text-4xl sm:text-6xl md:text-7xl ml-1 font-normal ${
            themeConfig?.headerHeroAccent || 'text-pink-500'
          }`}
        >
          Our Story
        </span>
      </h1>

      <p className="text-sm sm:text-base font-cute opacity-80 max-w-xl mx-auto mb-6">
        Setiap gambar punya cerita, setiap tanggal punya makna. Koleksi momen berharga yang terukir manis di sampingmu. 💖
      </p>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-7">
        {/* Total Photos */}
        <div
          className={`p-3 rounded-2xl border shadow-xs flex items-center gap-2.5 backdrop-blur-xs ${
            themeConfig?.statCard || 'bg-white/85 border-pink-200/80'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              themeConfig?.statCameraBg || 'bg-pink-100 text-pink-600'
            }`}
          >
            <Camera className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className={`text-lg font-bold font-cute leading-none ${themeConfig?.statText || 'text-slate-800'}`}>
              {stats?.total || 0}
            </div>
            <div className={`text-[11px] font-cute mt-0.5 ${themeConfig?.statSubText || 'text-slate-400'}`}>
              Foto Kenangan
            </div>
          </div>
        </div>

        {/* Days count */}
        <div
          className={`p-3 rounded-2xl border shadow-xs flex items-center gap-2.5 backdrop-blur-xs ${
            themeConfig?.statCard || 'bg-white/85 border-rose-200/80'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              themeConfig?.statHeartBg || 'bg-rose-100 text-rose-600'
            }`}
          >
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div className="text-left">
            <div className={`text-lg font-bold font-cute leading-none ${themeConfig?.statText || 'text-slate-800'}`}>
              {stats?.totalDays || 1} Hari
            </div>
            <div className={`text-[11px] font-cute mt-0.5 ${themeConfig?.statSubText || 'text-slate-400'}`}>
              Perjalanan Indah
            </div>
          </div>
        </div>

        {/* First Date */}
        <div
          className={`col-span-2 sm:col-span-1 p-3 rounded-2xl border shadow-xs flex items-center gap-2.5 backdrop-blur-xs ${
            themeConfig?.statCard || 'bg-white/85 border-purple-200/80'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              themeConfig?.statCalendarBg || 'bg-purple-100 text-purple-600'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className={`text-xs font-bold font-cute line-clamp-1 leading-none ${themeConfig?.statText || 'text-slate-800'}`}>
              {earliestDateInfo ? earliestDateInfo.fullDate : 'Mulai Hari Ini'}
            </div>
            <div className={`text-[11px] font-cute mt-0.5 ${themeConfig?.statSubText || 'text-slate-400'}`}>
              Momen Pertama
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        {/* ADD MEMORY BUTTON */}
        <button
          onClick={() => {
            playPopSound();
            onOpenAddModal();
          }}
          className={`px-6 py-3 rounded-full bg-gradient-to-r ${
            themeConfig?.buttonPrimary || 'from-pink-500 via-rose-500 to-pink-600 shadow-pink-300/50'
          } text-white font-cute font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 animate-pulse-glow`}
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Foto Baru {themeConfig?.emoji || '🌸'}</span>
        </button>

        {/* SHARE LINK / QR BUTTON */}
        <button
          onClick={() => {
            playPopSound();
            onOpenShareModal();
          }}
          className={`px-5 py-3 rounded-full ${
            themeConfig?.buttonSecondary || 'bg-white hover:bg-pink-50 text-pink-600 border-pink-200'
          } border-2 font-cute font-bold text-sm shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-2`}
        >
          <Share2 className="w-4 h-4" />
          <span>Bagikan Link 💌</span>
        </button>
      </div>

      {/* Filter & Sorting Controls */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto p-2 rounded-2xl border shadow-xs backdrop-blur-xs ${
          themeConfig?.searchContainer || 'bg-white/70 border-pink-100'
        }`}
      >
        {/* Search Input */}
        <div className="relative w-full sm:w-auto flex-1">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${themeConfig?.searchIcon || 'text-pink-400'}`} />
          <input
            type="text"
            placeholder="Cari momen, judul, atau cerita..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm font-cute focus:outline-none transition-all border border-transparent ${
              themeConfig?.searchInput || 'bg-pink-50/40 focus:border-pink-300 focus:bg-white'
            }`}
          />
        </div>

        {/* Sort Toggle Button */}
        <button
          onClick={() => {
            playPopSound();
            onToggleSort();
          }}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-cute font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 ${
            themeConfig?.sortButton || 'bg-pink-50 hover:bg-pink-100 text-pink-700'
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>
            {sortOrder === 'asc' ? 'Urut: Terlama ➔ Terbaru 📅' : 'Urut: Terbaru ➔ Terlama 📅'}
          </span>
        </button>
      </div>

    </header>
  );
}
