import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Smartphone, Share2, Sparkles } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, themeConfig }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isDark = Boolean(themeConfig?.isDark);

  // Compute shareable URLs
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173';
  
  // Local network URL for mobile testing
  const localIp = '10.198.104.75';
  const mobileWifiUrl = `http://${localIp}:5173`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sweet Moments 🌸 Galeri Kenangan Kita',
          text: 'Yuk lihat dan tambahkan foto kenangan manis kita di sini! ✨',
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopy(currentUrl);
    }
  };

  // QR Code URL using api.qrserver.com
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=${
    isDark ? '6366f1' : 'ec4899'
  }&bgcolor=ffffff&data=${encodeURIComponent(
    mobileWifiUrl || currentUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-2 border-purple-500/40 text-slate-100 shadow-purple-950/60'
            : 'bg-white border-4 border-pink-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 text-white flex items-center justify-between border-b ${
            isDark
              ? 'bg-gradient-to-r from-slate-800 via-indigo-950 to-purple-950 border-purple-500/30'
              : 'bg-gradient-to-r from-pink-400 to-rose-400 border-transparent'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">💌</span>
            <div>
              <h3 className="font-cute font-bold text-lg">Bagikan Link Galeri</h3>
              <p
                className={`text-xs font-cute ${
                  isDark ? 'text-purple-300' : 'text-pink-100'
                }`}
              >
                Akses langsung dari HP atau Laptop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* QR Code Section */}
          <div
            className={`flex flex-col items-center p-4 rounded-2xl border text-center ${
              isDark
                ? 'bg-slate-800/70 border-slate-700'
                : 'bg-pink-50/50 border-pink-100'
            }`}
          >
            <div
              className={`p-3 rounded-2xl shadow-md border-2 mb-2.5 ${
                isDark
                  ? 'bg-white border-purple-500/40'
                  : 'bg-white border-pink-200'
              }`}
            >
              <img
                src={qrCodeUrl}
                alt="QR Code Galeri"
                className="w-40 h-40 object-contain rounded-lg"
              />
            </div>
            <p
              className={`text-xs font-cute font-bold flex items-center gap-1.5 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              <Smartphone className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
              <span>Scan QR ini lewat kamera HP kamu!</span>
            </p>
            <p className="text-[11px] text-slate-400 font-cute mt-0.5">
              Bisa langsung buka dan upload foto dari galeri HP
            </p>
          </div>

          {/* Share Links */}
          <div className="space-y-3">
            <div>
              <label
                className={`block text-xs font-bold font-cute mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Link Akses di HP (Jaringan Wi-Fi Sama):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={mobileWifiUrl}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-pink-200 text-slate-700'
                  }`}
                />
                <button
                  onClick={() => handleCopy(mobileWifiUrl)}
                  className={`px-3.5 py-2 rounded-xl text-white text-xs font-cute font-bold flex items-center gap-1 transition-colors shrink-0 ${
                    isDark
                      ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30'
                      : 'bg-pink-500 hover:bg-pink-600'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-bold font-cute mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Link Browser Sekarang:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-pink-200 text-slate-700'
                  }`}
                />
                <button
                  onClick={() => handleCopy(currentUrl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-cute font-bold flex items-center gap-1 transition-colors shrink-0 ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
                      : 'bg-pink-100 hover:bg-pink-200 text-pink-700'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Native Share button */}
          <button
            onClick={handleNativeShare}
            className={`w-full py-3 rounded-2xl text-white font-cute font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 ${
              isDark
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/40 hover:shadow-indigo-500/60'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-300/50 hover:shadow-xl'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan ke WhatsApp / Medsos 🌸</span>
          </button>
        </div>

      </div>
    </div>
  );
}
