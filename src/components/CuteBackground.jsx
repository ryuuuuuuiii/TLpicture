import React, { useMemo } from 'react';

export default function CuteBackground({ themeConfig, particlesEnabled = true }) {
  const emojis = themeConfig?.particles || ['🌸', '✨', '💖', '🎀', '☁️', '🍓', '💫', '🌷'];

  // Generate random static particles based on current theme emojis
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(i * 5.5 + Math.random() * 4) % 96}%`,
      top: `${(i * 6.5 + Math.random() * 5) % 95}%`,
      size: 14 + Math.random() * 16,
      opacity: 0.25 + Math.random() * 0.35,
      animationDuration: `${5 + (i % 5) * 2}s`,
      delay: `${(i % 4) * 0.8}s`,
    }));
  }, [emojis]);

  const orb1 = themeConfig?.orb1 || 'bg-pink-200/40';
  const orb2 = themeConfig?.orb2 || 'bg-rose-200/30';
  const orb3 = themeConfig?.orb3 || 'bg-purple-100/40';
  const orb4 = themeConfig?.orb4 || 'bg-amber-100/35';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft gradient ambient blurs with theme coloring */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${orb1} blur-3xl transition-colors duration-700`} />
      <div className={`absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full ${orb2} blur-3xl transition-colors duration-700`} />
      <div className={`absolute bottom-10 left-1/4 w-80 h-80 rounded-full ${orb3} blur-3xl transition-colors duration-700`} />
      <div className={`absolute bottom-0 right-10 w-96 h-96 rounded-full ${orb4} blur-3xl transition-colors duration-700`} />

      {/* Floating cute elements if enabled */}
      {particlesEnabled &&
        particles.map((p) => (
          <span
            key={p.id}
            className="absolute select-none transition-transform"
            style={{
              left: p.left,
              top: p.top,
              fontSize: `${p.size}px`,
              opacity: p.opacity,
              animation: `floatGentle ${p.animationDuration} ease-in-out infinite alternate`,
              animationDelay: p.delay,
            }}
          >
            {p.emoji}
          </span>
        ))}
    </div>
  );
}
