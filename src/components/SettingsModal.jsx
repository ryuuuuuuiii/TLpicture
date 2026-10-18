import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  Music,
  Palette,
  Sliders,
  Check,
  Play,
  Pause,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MUSIC_TRACKS,
  toggleAmbientMusic,
  setMusicTrack,
  setMasterVolume,
  setSfxEnabled,
  playPopSound,
  playSparkleSound,
} from '../utils/cuteAudio';
import { THEMES } from '../utils/themeConfig';

export default function SettingsModal({
  isOpen,
  onClose,
  audioState,
  currentTheme,
  onSelectTheme,
  particlesEnabled,
  onToggleParticles,
}) {
  if (!isOpen) return null;

  const activeThemeConfig = THEMES[currentTheme] || THEMES.pink;
  const isDark = Boolean(activeThemeConfig?.isDark);

  const handleToggleMusic = () => {
    playPopSound();
    toggleAmbientMusic();
  };

  const handleSelectTrack = (trackId) => {
    playSparkleSound();
    setMusicTrack(trackId);
    if (!audioState.isPlaying) {
      toggleAmbientMusic();
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
  };

  const handleToggleSfx = () => {
    playPopSound();
    setSfxEnabled(!audioState.sfxEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      {/* Modal Dialog Card */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-2 border-purple-500/40 text-slate-100 shadow-purple-950/50'
            : 'bg-white border-2 border-pink-200 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Washi Tape Decoration */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 rounded-xs z-30 opacity-90 shadow-xs flex items-center justify-center pointer-events-none ${
            isDark
              ? 'bg-gradient-to-r from-indigo-700 to-purple-700 text-indigo-100 border border-indigo-500/50'
              : 'washi-tape-pink text-pink-700 font-bold'
          }`}
        >
          <span className="text-[9px] font-mono tracking-widest font-bold">
            ♥ SETTINGS ♥
          </span>
        </div>

        {/* Modal Header */}
        <div
          className={`px-5 pt-6 pb-4 border-b flex items-center justify-between ${
            isDark
              ? 'bg-slate-800/90 border-slate-700/80 text-white'
              : 'bg-linear-to-r from-pink-50 via-rose-50 to-pink-100/60 border-pink-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs border ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-purple-300'
                  : 'bg-white border-pink-200 text-pink-500'
              }`}
            >
              ⚙️
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-cute flex items-center gap-1.5">
                <span>Pengaturan & Suara</span>
                <span className="text-xs">{activeThemeConfig.emoji}</span>
              </h2>
              <p
                className={`text-xs font-cute ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Pilih musik latar favorit & ganti tema visual kenangan
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 border-pink-200'
            }`}
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* --- SECTION 1: MUSIK & SUARA --- */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-cute font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-purple-400' : 'text-pink-600'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Musik Latar & Suara</span>
              </span>

              {/* Master Mute / Unmute Button */}
              <button
                onClick={handleToggleMusic}
                className={`px-3 py-1.5 rounded-full text-xs font-cute font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  audioState.isPlaying
                    ? isDark
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/40 ring-1 ring-purple-400'
                      : 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-300/40'
                    : isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {audioState.isPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Musik Aktif 🎶</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Musik Mati 🔇</span>
                  </>
                )}
              </button>
            </div>

            {/* Music Track Cards Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MUSIC_TRACKS.map((track) => {
                const isSelected = audioState.track === track.id;
                const isCurrentPlaying = isSelected && audioState.isPlaying;

                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(track.id)}
                    className={`p-3 rounded-2xl text-left border-2 transition-all relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? isDark
                          ? 'bg-purple-950/60 border-purple-500 shadow-sm text-white'
                          : 'bg-pink-50/70 border-pink-500 shadow-sm'
                        : isDark
                        ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600 text-slate-200'
                        : 'bg-white hover:bg-pink-50/30 border-pink-100 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{track.emoji}</span>
                        <span
                          className={`font-cute font-bold text-xs sm:text-sm ${
                            isSelected
                              ? isDark
                                ? 'text-purple-300'
                                : 'text-pink-600'
                              : isDark
                              ? 'text-slate-100'
                              : 'text-slate-800'
                          }`}
                        >
                          {track.title}
                        </span>
                      </div>

                      {/* Playing / Select indicator */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                          isSelected
                            ? isDark
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-pink-500 text-white shadow-xs'
                            : isDark
                            ? 'bg-slate-700 text-slate-400 group-hover:bg-purple-900 group-hover:text-purple-300'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-600'
                        }`}
                      >
                        {isCurrentPlaying ? (
                          <span className="animate-spin-slow">🎵</span>
                        ) : isSelected ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Play className="w-2.5 h-2.5 fill-current" />
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-[11px] font-cute leading-tight ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {track.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Volume Slider Control */}
            <div
              className={`p-3 rounded-2xl border flex items-center gap-3 ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-pink-50/50 border-pink-100/80'
              }`}
            >
              <div
                className={`shrink-0 ${
                  isDark ? 'text-purple-400' : 'text-pink-500'
                }`}
              >
                {audioState.volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : audioState.volume < 0.4 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div
                  className={`flex items-center justify-between text-[11px] font-cute font-bold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <span>Volume Musik</span>
                  <span>{Math.round(audioState.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioState.volume}
                  onChange={handleVolumeChange}
                  className={`w-full cursor-pointer h-1.5 rounded-lg ${
                    isDark
                      ? 'accent-purple-400 bg-slate-700'
                      : 'accent-pink-500 bg-pink-200'
                  }`}
                />
              </div>
            </div>

            {/* SFX Toggle */}
            <div
              className={`flex items-center justify-between p-3 rounded-2xl border shadow-2xs ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white'
                  : 'bg-white border-pink-100 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎈</span>
                <div>
                  <div className="text-xs font-cute font-bold">
                    Efek Suara Lucu (SFX)
                  </div>
                  <div
                    className={`text-[10px] font-cute ${
                      isDark ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    Suara pop & sparkle saat tombol atau like ditekan
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleSfx}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  audioState.sfxEnabled
                    ? isDark
                      ? 'bg-purple-600'
                      : 'bg-pink-500'
                    : isDark
                    ? 'bg-slate-700'
                    : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    audioState.sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* --- SECTION 2: GANTI TEMA WARNA --- */}
          <div
            className={`space-y-3.5 pt-2 border-t ${
              isDark ? 'border-slate-800' : 'border-pink-100/80'
            }`}
          >
            <span
              className={`text-xs font-cute font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-purple-400' : 'text-pink-600'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Ganti Tema Warna</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(THEMES).map((theme) => {
                const isSelected = currentTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      playSparkleSound();
                      onSelectTheme(theme.id);
                    }}
                    className={`p-3 rounded-2xl text-left border-2 transition-all relative flex items-center gap-3 ${
                      isSelected
                        ? isDark
                          ? 'border-purple-400 bg-purple-950/70 shadow-sm ring-1 ring-purple-400/50'
                          : 'border-pink-500 bg-pink-50/60 shadow-sm'
                        : isDark
                        ? 'border-slate-700/80 bg-slate-800/80 hover:border-slate-600 hover:bg-slate-800 text-slate-200'
                        : 'border-slate-200/80 hover:border-pink-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {/* Theme Color Preview Pill */}
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-xs shrink-0 border border-white/40"
                      style={{
                        backgroundColor: theme.accentColor + '30',
                      }}
                    >
                      {theme.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-cute font-bold text-xs sm:text-sm truncate ${
                            isSelected
                              ? isDark
                                ? 'text-purple-300'
                                : 'text-pink-600'
                              : isDark
                              ? 'text-white'
                              : 'text-slate-800'
                          }`}
                        >
                          {theme.name}
                        </span>
                        {isSelected && (
                          <span
                            className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] shrink-0 ${
                              isDark ? 'bg-purple-600' : 'bg-pink-500'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[10.5px] font-cute line-clamp-1 mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {theme.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- SECTION 3: ANIMASI & TAMPILAN LAINNYA --- */}
          <div
            className={`space-y-3.5 pt-2 border-t ${
              isDark ? 'border-slate-800' : 'border-pink-100/80'
            }`}
          >
            <span
              className={`text-xs font-cute font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-purple-400' : 'text-pink-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Animasi & Hiasan</span>
            </span>

            {/* Floating Particles Toggle */}
            <div
              className={`flex items-center justify-between p-3 rounded-2xl border shadow-2xs ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white'
                  : 'bg-white border-pink-100 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🌸</span>
                <div>
                  <div className="text-xs font-cute font-bold">
                    Hiasan Melayang di Layar
                  </div>
                  <div
                    className={`text-[10px] font-cute ${
                      isDark ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    Kelopak bunga & bintang pastel melayang lembut
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  playPopSound();
                  onToggleParticles();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  particlesEnabled
                    ? isDark
                      ? 'bg-purple-600'
                      : 'bg-pink-500'
                    : isDark
                    ? 'bg-slate-700'
                    : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    particlesEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-slate-400'
              : 'bg-slate-50 border-pink-100 text-slate-400'
          }`}
        >
          <span className="text-[11px] font-cute">
            Tersimpan otomatis {activeThemeConfig.emoji}
          </span>

          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className={`px-6 py-2 rounded-full text-white font-cute font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 ${
              isDark
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/40'
                : 'bg-pink-500 hover:bg-pink-600 shadow-pink-300/40'
            }`}
          >
            Selesai ✨
          </button>
        </div>

      </div>
    </div>
  );
}
