import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Move,
  Crop,
  Check,
  ArrowLeftRight,
  Maximize2,
  Sliders,
} from 'lucide-react';

export const CROP_PRESETS = [
  { id: '3:4', label: '📱 3:4 Portrait', desc: 'Foto portrait / selfie HP' },
  { id: '4:3', label: '📸 4:3 Landscape', desc: 'Standar landscape album' },
  { id: '1:1', label: '⏹️ 1:1 Persegi', desc: 'Kotak persegi / Instagram' },
  { id: '9:16', label: '📲 9:16 Story', desc: 'Tinggi vertikal penuh HP' },
  { id: '16:9', label: '🖼️ 16:9 Lebar', desc: 'Sinematik pemandangan' },
  { id: 'free', label: '✨ Bebas / Kustom', desc: 'Bebas atur ukuran & proporsi foto sesukamu' },
];

export default function PhotoCropper({
  imageSrc,
  onCropComplete,
  onAspectChange,
  initialAspect = '4:3',
  isDark = false,
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState(initialAspect);
  const [customAspect, setCustomAspect] = useState(1); // For free mode slider
  const [fitMode, setFitMode] = useState('cover'); // 'cover' or 'contain'
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [naturalAspect, setNaturalAspect] = useState(4 / 3);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate numeric aspect value
  const getAspectValue = useCallback(() => {
    if (aspectRatio === '1:1') return 1;
    if (aspectRatio === '3:4') return 3 / 4;
    if (aspectRatio === '9:16') return 9 / 16;
    if (aspectRatio === '16:9') return 16 / 9;
    if (aspectRatio === '4:3') return 4 / 3;
    if (aspectRatio === 'free') return customAspect || naturalAspect || 4 / 3;
    return 4 / 3;
  }, [aspectRatio, customAspect, naturalAspect]);

  const aspectValue = getAspectValue();

  // Handle image load to detect natural dimensions
  const handleImageLoad = () => {
    if (imgRef.current) {
      const w = imgRef.current.naturalWidth || 800;
      const h = imgRef.current.naturalHeight || 600;
      const ratio = w / h;
      setNaturalAspect(ratio);
      setImageLoaded(true);

      // Default custom aspect to natural photo ratio initially
      setCustomAspect(Number(ratio.toFixed(2)));

      // If user uploaded a portrait photo and free mode is active, set it
      if (initialAspect === 'free') {
        setAspectRatio('free');
      }
    }
  };

  // Reset transforms when imageSrc changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setImageLoaded(false);
  }, [imageSrc]);

  // Notify parent of aspect ratio change (send either preset id or custom float)
  useEffect(() => {
    if (onAspectChange) {
      if (aspectRatio === 'free') {
        onAspectChange(String(customAspect));
      } else {
        onAspectChange(aspectRatio);
      }
    }
  }, [aspectRatio, customAspect, onAspectChange]);

  // Generate cropped output canvas
  const generateCrop = useCallback(() => {
    if (!imgRef.current || !imageLoaded) return;

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard output resolution based on aspect
    const baseDim = 960;
    let outWidth, outHeight;

    if (aspectValue >= 1) {
      outWidth = baseDim;
      outHeight = Math.round(baseDim / aspectValue);
    } else {
      outHeight = baseDim;
      outWidth = Math.round(baseDim * aspectValue);
    }

    canvas.width = Math.max(200, outWidth);
    canvas.height = Math.max(200, outHeight);

    // Fill white background for transparent PNGs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const isRotated90 = rotation % 180 !== 0;
    const effImgW = isRotated90 ? img.naturalHeight : img.naturalWidth;
    const effImgH = isRotated90 ? img.naturalWidth : img.naturalHeight;

    let scaleFactor;
    if (fitMode === 'contain') {
      scaleFactor = Math.min(canvas.width / effImgW, canvas.height / effImgH);
    } else {
      scaleFactor = Math.max(canvas.width / effImgW, canvas.height / effImgH);
    }

    const drawW = img.naturalWidth * scaleFactor;
    const drawH = img.naturalHeight * scaleFactor;

    const containerW = containerRef.current?.clientWidth || 300;
    const offsetFactor = canvas.width / containerW;

    ctx.translate(offset.x * offsetFactor, offset.y * offsetFactor);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          if (onCropComplete) {
            onCropComplete({
              blob,
              dataUrl,
              aspectRatio: aspectRatio === 'free' ? String(customAspect) : aspectRatio,
            });
          }
        }
      },
      'image/jpeg',
      0.92
    );
  }, [aspectValue, zoom, rotation, offset, imageLoaded, fitMode, onCropComplete, aspectRatio, customAspect]);

  // Update crop output when parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      generateCrop();
    }, 100);
    return () => clearTimeout(timer);
  }, [generateCrop]);

  // Handle Dragging (Mouse & Touch)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setFitMode('cover');
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Flip orientation between portrait and landscape
  const handleToggleOrientation = () => {
    if (aspectRatio === '4:3') setAspectRatio('3:4');
    else if (aspectRatio === '3:4') setAspectRatio('4:3');
    else if (aspectRatio === '16:9') setAspectRatio('9:16');
    else if (aspectRatio === '9:16') setAspectRatio('16:9');
    else if (aspectRatio === 'free') {
      setCustomAspect((prev) => Number((1 / prev).toFixed(2)));
    }
  };

  // Compute actual viewport pixel dimensions to GUARANTEE portrait looks portrait!
  let computedW = 320;
  let computedH = 240;

  if (aspectValue < 1) {
    // PORTRAIT: Height is 280px, Width is scaled down accordingly!
    computedH = 280;
    computedW = Math.round(280 * aspectValue);
  } else if (aspectValue === 1) {
    // SQUARE: 260px x 260px
    computedW = 260;
    computedH = 260;
  } else {
    // LANDSCAPE: Width is 340px, Height is scaled down accordingly!
    computedW = 340;
    computedH = Math.round(340 / aspectValue);
  }

  return (
    <div
      className={`w-full space-y-3 p-3 sm:p-4 rounded-2xl border shadow-xs transition-colors ${
        isDark
          ? 'bg-slate-900/95 border-purple-500/40 text-slate-100 shadow-purple-950/40'
          : 'bg-pink-50/50 border-pink-200 text-slate-800'
      }`}
    >
      {/* Aspect Ratio Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-cute font-bold flex items-center gap-1.5 ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            <Crop className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
            <span>Pilihan Ukuran & Orientasi Foto</span>
          </span>

          <button
            type="button"
            onClick={handleToggleOrientation}
            className={`px-2.5 py-1 rounded-xl text-[10.5px] font-cute font-bold border shadow-2xs flex items-center gap-1 transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-500/30'
                : 'bg-white hover:bg-pink-100 text-pink-700 border-pink-200'
            }`}
            title="Tukar Portrait ↔ Landscape"
          >
            <ArrowLeftRight className={`w-3 h-3 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
            <span>Putar Rasio</span>
          </button>
        </div>

        {/* Preset Pills */}
        <div
          className={`grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 rounded-xl border shadow-2xs ${
            isDark
              ? 'bg-slate-800/90 border-slate-700'
              : 'bg-white border-pink-200/80'
          }`}
        >
          {CROP_PRESETS.map((preset) => {
            const isSelected = aspectRatio === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setAspectRatio(preset.id);
                  if (preset.id === 'free') {
                    setCustomAspect(Number(naturalAspect.toFixed(2)));
                  }
                }}
                className={`py-1.5 px-1.5 rounded-lg text-[10px] font-cute font-bold transition-all text-center truncate ${
                  isSelected
                    ? isDark
                      ? 'bg-purple-600 text-white shadow-xs scale-102 ring-1 ring-purple-400'
                      : 'bg-pink-500 text-white shadow-xs scale-102 ring-1 ring-pink-400'
                    : isDark
                    ? 'text-slate-300 hover:text-purple-300 hover:bg-slate-700/70'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/60'
                }`}
                title={preset.desc}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MODE BEBAS / KUSTOM CONTROLS --- */}
      {aspectRatio === 'free' && (
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border space-y-2 shadow-2xs animate-fade-in ${
            isDark
              ? 'bg-slate-800/90 border-slate-700 text-slate-200'
              : 'bg-white border-pink-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-cute font-bold">
            <span className="flex items-center gap-1">
              <Sliders className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
              <span>Atur Bentuk Frame Bebas</span>
            </span>
            <span
              className={`font-mono text-[11px] font-bold ${
                isDark ? 'text-purple-300' : 'text-pink-600'
              }`}
            >
              {customAspect < 0.95
                ? '📱 Portrait Tegak'
                : customAspect > 1.05
                ? '📸 Landscape Mendatar'
                : '⏹️ Persegi'}{' '}
              ({customAspect})
            </span>
          </div>

          {/* Slider from 0.5 (Tinggi vertikal) to 2.0 (Lebar horizontal) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-cute shrink-0">📱 Portrait</span>
            <input
              type="range"
              min="0.5"
              max="2.1"
              step="0.05"
              value={customAspect}
              onChange={(e) => setCustomAspect(parseFloat(e.target.value))}
              className={`flex-1 cursor-pointer h-1.5 rounded-lg ${
                isDark
                  ? 'accent-purple-400 bg-slate-700'
                  : 'accent-pink-500 bg-pink-200'
              }`}
            />
            <span className="text-[10px] text-slate-400 font-cute shrink-0">Landscape 📸</span>
          </div>

          {/* Mode Bebas Action Buttons */}
          <div
            className={`flex items-center justify-between flex-wrap gap-2 pt-1 border-t text-[10px] font-cute ${
              isDark ? 'border-slate-700' : 'border-pink-100'
            }`}
          >
            <button
              type="button"
              onClick={() => setCustomAspect(Number(naturalAspect.toFixed(2)))}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-purple-300 border-slate-600'
                  : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'
              }`}
            >
              ✦ Pas Sesuai Foto Asli ({naturalAspect.toFixed(2)})
            </button>

            <button
              type="button"
              onClick={() => setFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'))}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 ${
                fitMode === 'contain'
                  ? isDark
                    ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                    : 'bg-pink-500 text-white border-pink-500 shadow-xs'
                  : isDark
                  ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-pink-50'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span>{fitMode === 'contain' ? '✓ Tampilkan Seluruh Foto Utuh' : 'Mode: Isi Penuh Frame'}</span>
            </button>
          </div>
        </div>
      )}

      {/* --- VISUAL CROP VIEWPORT CONTAINER --- */}
      {/* Outer dark letterbox canvas to highlight exact photo orientation */}
      <div className="w-full flex items-center justify-center p-3 bg-slate-950/80 rounded-2xl min-h-[300px] border border-slate-800 shadow-inner overflow-hidden">
        
        {/* Inner Crop Viewport Box (Strictly matches the aspect ratio!) */}
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-xl border-2 border-dashed cursor-grab active:cursor-grabbing select-none shadow-2xl transition-all duration-300 bg-slate-900 flex items-center justify-center shrink-0 ${
            isDark ? 'border-purple-400' : 'border-pink-400'
          }`}
          style={{
            width: `${computedW}px`,
            height: `${computedH}px`,
            maxWidth: '100%',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Invisible image for natural measurements */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Source"
            crossOrigin="anonymous"
            className="hidden"
            onLoad={handleImageLoad}
          />

          {/* Display Image with Transform */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={imageSrc}
              alt="Crop Preview"
              className={`w-full h-full ${
                fitMode === 'contain' ? 'object-contain' : 'object-cover'
              } transition-none pointer-events-none`}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            />
          </div>

          {/* Rule of Thirds Grid Guidelines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
            <div className="border-r border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div className="border-r border-b border-white/60" />
            <div />
          </div>

          {/* Drag Helper Tip Badge */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[9px] font-cute flex items-center gap-1 pointer-events-none">
            <Move className="w-2.5 h-2.5" />
            <span>Geser posisi foto</span>
          </div>

          {/* Current Aspect Badge */}
          <div
            className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-[9px] font-cute font-bold shadow-xs pointer-events-none ${
              isDark ? 'bg-purple-600' : 'bg-pink-500'
            }`}
          >
            {aspectRatio === 'free' ? `${customAspect}` : aspectRatio.toUpperCase()}
          </div>

          {/* Rotation Badge */}
          {rotation > 0 && (
            <div
              className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-white text-[9px] font-cute font-bold shadow-xs pointer-events-none ${
                isDark ? 'bg-purple-600' : 'bg-pink-500'
              }`}
            >
              {rotation}°
            </div>
          )}
        </div>

      </div>

      {/* Adjustment Controls Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Zoom Slider */}
        <div className="flex items-center gap-2 flex-1">
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
            className={`p-1.5 rounded-lg transition-colors border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-pink-100 text-slate-600 border-pink-200'
            }`}
            title="Perkecil Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className={`w-full cursor-pointer h-1.5 rounded-lg ${
              isDark
                ? 'accent-purple-400 bg-slate-700'
                : 'accent-pink-500 bg-pink-200'
            }`}
          />

          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
            className={`p-1.5 rounded-lg transition-colors border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-pink-100 text-slate-600 border-pink-200'
            }`}
            title="Perbesar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span
            className={`text-[10px] font-cute font-bold w-8 text-right shrink-0 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Action Buttons: Rotate & Reset */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleRotate}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-cute font-bold border shadow-2xs flex items-center gap-1 transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-pink-50 text-slate-700 border-pink-200'
            }`}
            title="Putar 90 Derajat"
          >
            <RotateCw className={`w-3 h-3 ${isDark ? 'text-purple-400' : 'text-pink-500'}`} />
            <span className="hidden sm:inline">Putar</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-cute font-bold border shadow-2xs flex items-center gap-1 transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-800 hover:bg-rose-950/60 text-rose-300 border-slate-700'
                : 'bg-white hover:bg-rose-50 text-slate-600 border-pink-200'
            }`}
            title="Kembalikan ke Posisi Awal"
          >
            <RefreshCw className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

    </div>
  );
}
