import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TimelineItem from './components/TimelineItem';
import AddMemoryModal from './components/AddMemoryModal';
import PhotoLightbox from './components/PhotoLightbox';
import ShareModal from './components/ShareModal';
import SettingsModal from './components/SettingsModal';
import CuteBackground from './components/CuteBackground';
import { Plus, Heart, Sparkles, ImageOff, Settings, Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';
import { playPopSound, playSparkleSound, subscribeAudioState, getAudioPrefs } from './utils/cuteAudio';
import { THEMES } from './utils/themeConfig';

export default function App() {
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for chronological
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Audio & Settings State
  const [audioState, setAudioState] = useState(getAudioPrefs());
  
  // Theme state with localStorage persistence
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      return localStorage.getItem('sweet_moments_theme') || 'pink';
    } catch (e) {
      return 'pink';
    }
  });

  // Particles state with localStorage persistence
  const [particlesEnabled, setParticlesEnabled] = useState(() => {
    try {
      const val = localStorage.getItem('sweet_moments_particles');
      return val !== 'false';
    } catch (e) {
      return true;
    }
  });

  // Subscribe to audio synthesizer state changes
  useEffect(() => {
    const unsubscribe = subscribeAudioState((newState) => {
      setAudioState(newState);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem('sweet_moments_theme', themeId);
    } catch (e) {}
  };

  const handleToggleParticles = () => {
    setParticlesEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sweet_moments_particles', String(next));
      } catch (e) {}
      return next;
    });
  };

  const themeConfig = THEMES[currentTheme] || THEMES.pink;

  // Fetch memories from backend
  const fetchMemories = async () => {
    try {
      const res = await fetch(`/api/memories?sort=${sortOrder}`);
      const data = await res.json();
      if (data.success) {
        setMemories(data.data);
      }
    } catch (err) {
      console.error('Error fetching memories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchMemories();
    fetchStats();
  }, [sortOrder]);

  // Handle Like / Unlike
  const handleLike = async (id, action = 'like') => {
    try {
      if (action === 'like') {
        playSparkleSound();
      } else {
        playPopSound();
      }
      const res = await fetch(`/api/memories/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setMemories((prev) =>
          prev.map((m) => (m.id === id ? { ...m, likes: data.likes } : m))
        );
      }
    } catch (err) {
      console.error('Error liking memory:', err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      playPopSound();
      await fetch(`/api/memories/${id}`, { method: 'DELETE' });
      setMemories((prev) => prev.filter((m) => m.id !== id));
      fetchStats();
    } catch (err) {
      console.error('Error deleting memory:', err);
    }
  };

  // Callback when new memory added
  const handleMemoryAdded = (newMemory) => {
    playSparkleSound();
    fetchMemories();
    fetchStats();
  };

  // Filter memories by search query
  const filteredMemories = memories.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      (m.author && m.author.toLowerCase().includes(q)) ||
      (m.date && m.date.includes(q)) ||
      (m.mood && m.mood.toLowerCase().includes(q))
    );
  });

  return (
    <div
      className={`relative min-h-screen ${themeConfig.appBg} ${themeConfig.appText} font-cute pb-24 overflow-x-hidden ${themeConfig.selection} transition-colors duration-500`}
    >
      {/* Dreamy cute background effects with theme support */}
      <CuteBackground themeConfig={themeConfig} particlesEnabled={particlesEnabled} />

      {/* --- TOP-LEFT FIXED SETTINGS & MUSIC BUTTON --- */}
      <div className="fixed top-3 left-3 sm:top-5 sm:left-6 z-40">
        <button
          onClick={() => {
            playPopSound();
            setIsSettingsModalOpen(true);
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full backdrop-blur-md shadow-md border transition-all hover:scale-105 active:scale-95 group ${
            themeConfig.isDark
              ? audioState.isPlaying
                ? 'bg-slate-900/95 text-purple-300 border-purple-500/50 shadow-purple-950/50 ring-2 ring-purple-400/40'
                : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:text-purple-300 hover:border-purple-500/40'
              : audioState.isPlaying
              ? 'bg-white/95 text-pink-600 border-pink-300 shadow-pink-300/40 ring-2 ring-pink-400/30'
              : 'bg-white/90 text-slate-600 border-pink-200/90 hover:text-pink-600'
          }`}
          title="Pengaturan Musik & Tema ⚙️"
        >
          {/* Gear / Sound Status Icon */}
          <div className="relative flex items-center justify-center">
            <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:rotate-90 transition-transform duration-300" />
            {audioState.isPlaying && (
              <span
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping ${
                  themeConfig.isDark ? 'bg-purple-400' : 'bg-pink-500'
                }`}
              />
            )}
          </div>

          {/* Label & Active Music Badge */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-cute font-bold">
            <span className="hidden min-[400px]:inline">Setelan</span>
            <span className="flex items-center gap-1">
              {audioState.isPlaying ? (
                <>
                  <span className="animate-bounce">🎶</span>
                  <span
                    className={`text-[10px] font-semibold hidden md:inline ${
                      themeConfig.isDark ? 'text-purple-300' : 'text-pink-500'
                    }`}
                  >
                    {themeConfig.emoji}
                  </span>
                </>
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </span>
          </div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">
        
        {/* Header with Stats, Search, and Action Buttons */}
        <Header
          stats={stats}
          sortOrder={sortOrder}
          onToggleSort={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          themeConfig={themeConfig}
        />

        {/* Timeline Gallery Section */}
        <main className="max-w-6xl mx-auto px-2 sm:px-6 relative">
          
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-12 h-12 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mb-3" />
              <p className="text-sm font-cute text-pink-500 font-bold">
                Membuka lembaran kenangan manis... 🌸
              </p>
            </div>
          ) : filteredMemories.length === 0 ? (
            /* Empty State */
            <div
              className={`py-16 px-4 text-center max-w-md mx-auto rounded-3xl border-2 border-dashed p-8 shadow-xs my-8 backdrop-blur-xs ${
                themeConfig.isDark
                  ? 'bg-slate-900/80 border-purple-500/40 text-slate-200'
                  : 'bg-white/70 border-pink-200 text-slate-800'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${
                  themeConfig.isDark ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40' : 'bg-pink-100 text-pink-500'
                }`}
              >
                {themeConfig.emoji || '🌸'}
              </div>
              <h3 className={`text-xl font-bold font-cute mb-1.5 ${themeConfig.isDark ? 'text-white' : 'text-slate-800'}`}>
                {searchQuery ? 'Tidak Ada Kenangan Yang Cocok' : 'Belum Ada Kenangan Tersimpan'}
              </h3>
              <p className={`text-xs sm:text-sm font-cute mb-6 ${themeConfig.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {searchQuery
                  ? `Kata kunci "${searchQuery}" tidak ditemukan di judul maupun deskripsi.`
                  : 'Jadilah yang pertama menambahkan momen indah dengan foto, tanggal, dan bingkai favoritmu!'}
              </p>
              <button
                onClick={() => {
                  playPopSound();
                  setIsAddModalOpen(true);
                }}
                className={`px-6 py-2.5 rounded-full bg-gradient-to-r ${themeConfig.buttonPrimary} text-white font-cute font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105`}
              >
                + Tambah Foto Pertama Sekarang 💖
              </button>
            </div>
          ) : (
            /* Active Timeline Container */
            <div className="relative py-12 sm:py-16 md:py-20">
              
              {/* Central Glowing Vertical Timeline Stitch Line (Visible on Mobile & Desktop) */}
              <div className="block absolute left-1/2 top-6 bottom-20 -translate-x-1/2 w-0.5 sm:w-1 z-0 pointer-events-none">
                <div
                  className="w-full h-full rounded-full opacity-65 transition-all duration-500"
                  style={{
                    background: themeConfig.timelineLine,
                    filter: `drop-shadow(0 0 4px ${themeConfig.timelineLineGlow})`,
                  }}
                />
              </div>

              {/* Timeline Items List (Alternating Left/Right side-by-side with generous breathing room) */}
              <div className="space-y-20 sm:space-y-28 md:space-y-40 relative z-10">
                {filteredMemories.map((memory, index) => (
                  <TimelineItem
                    key={memory.id}
                    memory={memory}
                    index={index}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onSelectPhoto={(mem) => setSelectedPhoto(mem)}
                    themeConfig={themeConfig}
                  />
                ))}
              </div>

              {/* Bottom Timeline Milestone End Cap */}
              <div className="flex flex-col items-center justify-center mt-20 mb-8">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-tr ${themeConfig.timelineHeartBg} text-white shadow-xl shadow-pink-300/60 flex items-center justify-center text-2xl animate-bounce border-2 border-white`}
                >
                  {themeConfig.emoji}
                </div>
                <span className={`font-romantic text-3xl sm:text-4xl ${themeConfig.badgeText} mt-3 filter drop-shadow-xs`}>
                  To be continued in more sweet memories...
                </span>
                <span className="text-xs font-cute opacity-75 mt-1 font-semibold">
                  🌸 Setiap langkah adalah kisah yang tak terlupakan 🌸
                </span>
              </div>

            </div>
          )}

        </main>

        {/* Mobile Floating Action Button (FAB) */}
        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
          <button
            onClick={() => {
              playPopSound();
              setIsAddModalOpen(true);
            }}
            className={`w-14 h-14 rounded-full bg-gradient-to-r ${themeConfig.fabBg} text-white shadow-xl flex items-center justify-center text-2xl active:scale-90 transition-transform border-2 ${
              themeConfig.isDark ? 'border-purple-400' : 'border-white'
            } animate-pulse-glow`}
            title="Tambah Foto Baru"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Footer */}
        <footer
          className={`text-center py-8 text-xs font-cute opacity-70 border-t max-w-4xl mx-auto px-4 mt-12 ${
            themeConfig.isDark ? 'border-slate-800 text-slate-400' : 'border-pink-100/60'
          }`}
        >
          <p className="flex items-center justify-center gap-1.5 mb-1">
            <span>Dibuat dengan segenap</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
            <span>untuk mengabadikan setiap senyuman</span>
          </p>
          <p className="text-[11px] opacity-60">
            Sweet Moments Timeline • Bisa dibuka di HP & Laptop siapapun yang memiliki link ✨
          </p>
        </footer>

      </div>

      {/* --- MODALS --- */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMemoryAdded={handleMemoryAdded}
        themeConfig={themeConfig}
      />

      <PhotoLightbox
        memory={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onLike={handleLike}
        themeConfig={themeConfig}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        themeConfig={themeConfig}
      />

      {/* SETTINGS & AUDIO MODAL */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        audioState={audioState}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        particlesEnabled={particlesEnabled}
        onToggleParticles={handleToggleParticles}
      />
    </div>
  );
}
