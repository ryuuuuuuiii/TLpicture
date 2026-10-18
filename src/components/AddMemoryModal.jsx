import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  Heart,
  Smile,
  Check,
  Camera,
  Link as LinkIcon,
  Crop,
  Sliders,
} from 'lucide-react';
import FrameRenderer, { FRAME_TYPES } from './FrameRenderer';
import PhotoCropper from './PhotoCropper';
import confetti from 'canvas-confetti';
import { playPopSound, playSparkleSound } from '../utils/cuteAudio';

const MOODS = [
  '🥰 Romantis',
  '🌸 Bahagia',
  '✨ Spesial',
  '🍰 Manis',
  '🏖️ Liburan',
  '🎁 Kejutan',
  '☕ Hangout',
  '🌟 Berkesan',
];

const AVAILABLE_STICKERS = ['🌸', '✨', '💖', '🎀', '🍓', '🧸', '🍰', '💌', '🌈', '🦋', '🌷', '🍦'];

export default function AddMemoryModal({ isOpen, onClose, onMemoryAdded, themeConfig }) {
  const isDark = Boolean(themeConfig?.isDark);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('polaroid');
  const [selectedMood, setSelectedMood] = useState('🥰 Romantis');
  const [stickers, setStickers] = useState(['🌸', '✨']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cropper state
  const [isCroppingOpen, setIsCroppingOpen] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('4:3'); // '3:4', '4:3', '1:1', '9:16', '16:9', 'free'
  const [croppedData, setCroppedData] = useState(null); // { blob, dataUrl }

  const fileInputRef = useRef(null);

  // Reset all modal fields so no previous info/photo lingers
  const resetForm = useCallback(() => {
    setActiveTab('upload');
    setSelectedFile(null);
    setPreviewUrl('');
    setImageUrl('');
    setDate(new Date().toISOString().split('T')[0]);
    setTitle('');
    setDescription('');
    setAuthor('');
    setSelectedFrame('polaroid');
    setSelectedMood('🥰 Romantis');
    setStickers(['🌸', '✨']);
    setIsSubmitting(false);
    setErrorMsg('');
    setIsCroppingOpen(true);
    setAspectRatio('4:3');
    setCroppedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Reset all fields whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleClose = () => {
    playPopSound();
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Pilih file gambar (JPG, PNG, WebP) ya! 🌸');
        return;
      }
      setSelectedFile(file);
      setCroppedData(null);
      setErrorMsg('');
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setIsCroppingOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle sticker selection
  const toggleSticker = (emoji) => {
    playPopSound();
    if (stickers.includes(emoji)) {
      setStickers(stickers.filter((s) => s !== emoji));
    } else {
      if (stickers.length >= 4) {
        setStickers([...stickers.slice(1), emoji]);
      } else {
        setStickers([...stickers, emoji]);
      }
    }
  };

  // Handle crop completion from PhotoCropper
  const handleCropComplete = ({ blob, dataUrl }) => {
    setCroppedData({ blob, dataUrl });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'upload' && !selectedFile && !previewUrl) {
      setErrorMsg('Pilih foto terlebih dahulu ya manis! 📸');
      return;
    }
    if (activeTab === 'url' && !imageUrl.trim()) {
      setErrorMsg('Masukkan tautan URL foto ya! 🔗');
      return;
    }
    if (!date) {
      setErrorMsg('Tanggal momen wajib diisi ya! 📅');
      return;
    }

    setIsSubmitting(true);

    try {
      let res;

      // If cropped blob is available, upload it as a clean image file
      const fileToUpload = croppedData?.blob || selectedFile;

      if (fileToUpload) {
        const formData = new FormData();
        formData.append('imageFile', fileToUpload, 'memory.jpg');
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('author', author || 'Seseorang');
        formData.append('frame', selectedFrame);
        formData.append('aspectRatio', aspectRatio);
        formData.append('mood', selectedMood);
        formData.append('stickers', JSON.stringify(stickers));

        res = await fetch('/api/memories', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Fallback for direct image URL without crop
        const finalUrl = activeTab === 'url' ? imageUrl.trim() : previewUrl;
        res = await fetch('/api/memories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: finalUrl,
            title,
            description,
            date,
            author: author || 'Seseorang',
            frame: selectedFrame,
            aspectRatio,
            mood: selectedMood,
            stickers,
          }),
        });
      }

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan kenangan.');
      }

      // Celebratory Confetti blast!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#f43f5e', '#fda4af', '#fef08a'],
      });

      playSparkleSound();
      resetForm();
      onMemoryAdded(result.data);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image to display in the live frame preview
  const rawSourceImage =
    activeTab === 'upload'
      ? previewUrl || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80'
      : imageUrl || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80';

  const currentDisplayImage = croppedData?.dataUrl || rawSourceImage;

  const hasSelectedPhoto = activeTab === 'upload' ? Boolean(previewUrl) : Boolean(imageUrl.trim());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div
        className={`relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-2 border-purple-500/40 text-slate-100 shadow-purple-950/60'
            : 'bg-white border-4 border-pink-200 text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`relative p-4 sm:p-5 flex items-center justify-between border-b ${
            isDark
              ? 'bg-gradient-to-r from-slate-800 via-indigo-950 to-purple-950 border-purple-500/30 text-white'
              : 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 border-transparent text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs border ${
                isDark
                  ? 'bg-slate-800/80 border-purple-500/40 text-purple-300'
                  : 'bg-white/20 border-white/30 backdrop-blur-xs'
              }`}
            >
              {themeConfig?.emoji || '🌸'}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-cute tracking-tight">
                Simpan Kenangan Manis
              </h2>
              <p
                className={`text-xs font-cute ${
                  isDark ? 'text-purple-300' : 'text-pink-100'
                }`}
              >
                Sesuaikan foto & pilih bingkai favoritmu ✨
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div
              className={`mb-4 p-3 rounded-2xl text-sm font-cute flex items-center gap-2 border ${
                isDark
                  ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
            >
              <span>🥺</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT / TOP: Inputs, Cropper & Details (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Image Source Tabs */}
              <div>
                <label
                  className={`block text-xs font-bold font-cute mb-1.5 flex items-center gap-1.5 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <Camera className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
                  <span>Sumber Foto</span>
                </label>
                <div
                  className={`grid grid-cols-2 gap-2 p-1 rounded-2xl border ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700'
                      : 'bg-pink-50 border-pink-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveTab('upload');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-cute font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'upload'
                        ? isDark
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-pink-600 shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload dari HP / Laptop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setActiveTab('url');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-cute font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'url'
                        ? isDark
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-pink-600 shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Tautan URL Gambar</span>
                  </button>
                </div>

                {activeTab === 'upload' ? (
                  <div className="mt-2.5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                        isDark
                          ? 'border-purple-500/40 hover:border-purple-400 bg-slate-800/60 hover:bg-slate-800/90'
                          : 'border-pink-300 hover:border-pink-500 bg-pink-50/40 hover:bg-pink-50/70'
                      }`}
                    >
                      <Upload
                        className={`w-7 h-7 mx-auto mb-1 ${
                          isDark ? 'text-purple-400' : 'text-pink-400'
                        }`}
                      />
                      <p
                        className={`text-xs font-cute font-bold ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}
                      >
                        {selectedFile ? selectedFile.name : 'Ketuk untuk memilih foto dari galeri/kamera 📷'}
                      </p>
                      <p
                        className={`text-[11px] font-cute mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-400'
                        }`}
                      >
                        Mendukung JPG, PNG, WEBP, HEIC
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2.5">
                    <input
                      type="url"
                      placeholder="https://contoh.com/foto-cantik.jpg"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setCroppedData(null);
                      }}
                      className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-cute focus:outline-none focus:ring-2 ${
                        isDark
                          ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:ring-purple-400'
                          : 'bg-pink-50/30 border-pink-200 text-slate-800 placeholder-slate-400 focus:ring-pink-400'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* --- PHOTO CROP & ADJUSTMENT TOOL --- */}
              {hasSelectedPhoto && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setIsCroppingOpen(!isCroppingOpen);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cute font-bold transition-colors ${
                        isDark
                          ? 'bg-purple-900/40 hover:bg-purple-900/70 text-purple-300 border border-purple-500/30'
                          : 'bg-pink-100/80 hover:bg-pink-200 text-pink-700'
                      }`}
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>{isCroppingOpen ? 'Tutup Alat Crop ▲' : '✂️ Sesuaikan & Crop Foto ▼'}</span>
                      {croppedData && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isDark ? 'bg-purple-400' : 'bg-pink-500'
                          }`}
                        />
                      )}
                    </button>

                    <span
                      className={`text-[11px] font-cute ${
                        isDark ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      Geser & zoom agar pas di bingkai
                    </span>
                  </div>

                  {isCroppingOpen && (
                    <PhotoCropper
                      imageSrc={activeTab === 'upload' ? previewUrl : imageUrl}
                      onCropComplete={handleCropComplete}
                      onAspectChange={setAspectRatio}
                      initialAspect={aspectRatio}
                      isDark={isDark}
                    />
                  )}
                </div>
              )}

              {/* Date Input with "Hari Ini" Quick Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className={`text-xs font-bold font-cute flex items-center gap-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <Calendar className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
                    <span>Tanggal Foto Diambil / Terjadi *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setDate(new Date().toISOString().split('T')[0]);
                    }}
                    className={`text-[11px] font-cute font-bold hover:underline ${
                      isDark ? 'text-purple-400' : 'text-pink-500'
                    }`}
                  >
                    Hari ini 🌸
                  </button>
                </div>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-cute focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700 text-white focus:ring-purple-400 focus:border-purple-400 [color-scheme:dark]'
                      : 'bg-white border-pink-200 text-slate-800 focus:ring-pink-400'
                  }`}
                />
              </div>

              {/* Title Input */}
              <div>
                <label
                  className={`block text-xs font-bold font-cute mb-1.5 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Judul Kenangan 💖
                </label>
                <input
                  type="text"
                  placeholder="Misal: Kencan Pertama di Cafe ☕"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-cute focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:ring-purple-400 focus:border-purple-400'
                      : 'bg-white border-pink-200 text-slate-800 placeholder-slate-400 focus:ring-pink-400'
                  }`}
                />
              </div>

              {/* Description Input */}
              <div>
                <label
                  className={`block text-xs font-bold font-cute mb-1.5 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Cerita / Pesan Manis 💌
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan cerita singkat tentang apa yang terjadi di hari itu..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm font-cute resize-none focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:ring-purple-400 focus:border-purple-400'
                      : 'bg-white border-pink-200 text-slate-800 placeholder-slate-400 focus:ring-pink-400'
                  }`}
                />
              </div>

              {/* Author & Mood Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-bold font-cute mb-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Nama Pengirim / Pasangan
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Aku & Kamu"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-2xl border text-xs font-cute focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:ring-purple-400 focus:border-purple-400'
                        : 'bg-white border-pink-200 text-slate-800 placeholder-slate-400 focus:ring-pink-400'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold font-cute mb-1.5 ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    Mood Suasana
                  </label>
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-2xl border text-xs font-cute cursor-pointer focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-slate-800/90 border-slate-700 text-white focus:ring-purple-400 focus:border-purple-400 [color-scheme:dark]'
                        : 'bg-white border-pink-200 text-slate-800 focus:ring-pink-400'
                    }`}
                  >
                    {MOODS.map((m) => (
                      <option key={m} value={m} className={isDark ? 'bg-slate-800 text-white' : ''}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sticker Selector */}
              <div>
                <label
                  className={`block text-xs font-bold font-cute mb-1.5 flex items-center justify-between ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  <span>Pilih Stiker Tempelan ({stickers.length}/4)</span>
                  <span className={isDark ? 'text-purple-400 text-[11px]' : 'text-pink-400 text-[11px]'}>Ketuk untuk pasang</span>
                </label>
                <div
                  className={`flex flex-wrap gap-1.5 p-2 rounded-2xl border ${
                    isDark
                      ? 'bg-slate-800/70 border-slate-700'
                      : 'bg-pink-50/50 border-pink-100'
                  }`}
                >
                  {AVAILABLE_STICKERS.map((stk) => {
                    const isSelected = stickers.includes(stk);
                    return (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => toggleSticker(stk)}
                        className={`w-9 h-9 rounded-xl text-base flex items-center justify-center transition-all ${
                          isSelected
                            ? isDark
                              ? 'bg-purple-600 text-white scale-110 shadow-xs ring-2 ring-purple-400'
                              : 'bg-pink-400 text-white scale-110 shadow-xs ring-2 ring-pink-300'
                            : isDark
                            ? 'bg-slate-800 hover:bg-slate-700 hover:scale-105 border border-slate-700/80 text-white'
                            : 'bg-white hover:bg-pink-100 hover:scale-105'
                        }`}
                      >
                        {stk}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT: Live Frame Selector & Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <label
                className={`block text-xs font-bold font-cute mb-2 w-full text-left flex items-center gap-1.5 ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
                <span>Pilih Bingkai yang Diinginkan</span>
              </label>

              {/* Frame Selector Buttons */}
              <div className="w-full grid grid-cols-2 gap-2 mb-4">
                {FRAME_TYPES.map((f) => {
                  const isSelected = selectedFrame === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setSelectedFrame(f.id);
                      }}
                      className={`p-2 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? isDark
                            ? 'border-purple-400 bg-purple-950/70 shadow-md shadow-purple-950/60 scale-[1.02] text-white'
                            : 'border-pink-500 bg-pink-50/80 shadow-md shadow-pink-200/50 scale-[1.02]'
                          : isDark
                          ? 'border-slate-700 bg-slate-800/80 hover:border-slate-600 hover:bg-slate-800 text-slate-300'
                          : 'border-slate-100 bg-slate-50/60 hover:border-pink-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-cute font-bold line-clamp-1 ${
                            isDark ? (isSelected ? 'text-purple-300' : 'text-slate-100') : 'text-slate-800'
                          }`}
                        >
                          {f.name}
                        </span>
                        {isSelected && (
                          <span
                            className={`w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] shrink-0 ${
                              isDark ? 'bg-purple-600' : 'bg-pink-500'
                            }`}
                          >
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-cute line-clamp-1 mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-400'
                        }`}
                      >
                        {f.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Card */}
              <div
                className={`w-full max-w-[280px] p-2 rounded-2xl border shadow-inner ${
                  isDark
                    ? 'bg-slate-800/80 border-purple-500/30'
                    : 'bg-pink-50/40 border-pink-200/80'
                }`}
              >
                <div className="flex items-center justify-between px-1 mb-2">
                  <p
                    className={`text-[10px] font-cute font-bold uppercase tracking-wider ${
                      isDark ? 'text-purple-400' : 'text-pink-500'
                    }`}
                  >
                    ✦ Hasil Akhir Ter-upload ✦
                  </p>
                  <span
                    className={`text-[9px] font-cute ${
                      isDark ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {FRAME_TYPES.find((f) => f.id === selectedFrame)?.name}
                  </span>
                </div>

                <FrameRenderer
                  imageUrl={currentDisplayImage}
                  title={title || 'Judul Kenangan'}
                  date={date}
                  frame={selectedFrame}
                  stickers={stickers}
                  aspectRatio={aspectRatio}
                  isHoverable={false}
                />
              </div>

            </div>

          </div>

          {/* Submit Action Button */}
          <div
            className={`mt-6 pt-4 border-t flex items-center justify-end gap-3 ${
              isDark ? 'border-slate-800' : 'border-pink-100'
            }`}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-full border font-cute text-sm font-bold transition-colors ${
                isDark
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-full text-white font-cute text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/40 hover:shadow-indigo-500/60'
                  : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 shadow-pink-400/40 hover:shadow-pink-400/60'
              }`}
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Kenangan 🌸'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
