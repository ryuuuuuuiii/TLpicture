// Web Audio API Synthesizer with Multiple Tracks, Volume Control & SFX
let audioCtx = null;
let musicInterval = null;
let isMusicPlaying = false;
let currentTrack = 'romance'; // 'romance' | 'musicbox' | 'cafe' | 'starlight'
let masterVolume = 0.25;
let sfxEnabled = true;
let stateChangeListeners = [];

// Load persisted audio preferences safely
try {
  const saved = localStorage.getItem('sweet_moments_audio_prefs');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.track) currentTrack = parsed.track;
    if (typeof parsed.volume === 'number') masterVolume = parsed.volume;
    if (typeof parsed.sfx === 'boolean') sfxEnabled = parsed.sfx;
  }
} catch (e) {}

function savePrefs() {
  try {
    localStorage.setItem(
      'sweet_moments_audio_prefs',
      JSON.stringify({
        track: currentTrack,
        volume: masterVolume,
        sfx: sfxEnabled,
      })
    );
  } catch (e) {}
}

function notifyListeners() {
  const state = {
    isPlaying: isMusicPlaying,
    track: currentTrack,
    volume: masterVolume,
    sfxEnabled,
  };
  stateChangeListeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {}
  });
}

export function subscribeAudioState(fn) {
  stateChangeListeners.push(fn);
  fn({
    isPlaying: isMusicPlaying,
    track: currentTrack,
    volume: masterVolume,
    sfxEnabled,
  });
  return () => {
    stateChangeListeners = stateChangeListeners.filter((l) => l !== fn);
  };
}

function getAudioContext() {
  try {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext error:', e);
    return null;
  }
}

// Cute bubble pop sound for buttons & clicks
export function playPopSound() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.linearRampToValueAtTime(840, now + 0.12);

    const vol = Math.max(0.01, masterVolume * 0.6);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {
    console.warn('SFX pop error:', e);
  }
}

// Sparkle Chime Sound for Likes & Sweet Moments
export function playSparkleSound() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const vol = Math.max(0.01, masterVolume * 0.4);

    notes.forEach((freq, i) => {
      const noteTime = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(vol, noteTime);
      gain.gain.linearRampToValueAtTime(0.0001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.42);
    });
  } catch (e) {
    console.warn('SFX sparkle error:', e);
  }
}

// --- MUSIC TRACKS DEFINITIONS ---
export const MUSIC_TRACKS = [
  {
    id: 'romance',
    title: 'Sweet Romance',
    emoji: '🌸',
    desc: 'Lofi Chords lembut & damai yang menghangatkan hati',
    tempo: 3800,
  },
  {
    id: 'musicbox',
    title: 'Music Box Memories',
    emoji: '🧸',
    desc: 'Petikan arpeggio kotak musik vintage yang manis',
    tempo: 3200,
  },
  {
    id: 'cafe',
    title: 'Cozy Afternoon Cafe',
    emoji: '☕',
    desc: 'Nuansa jazz lofi santai seperti duduk berdua di kafe',
    tempo: 3600,
  },
  {
    id: 'starlight',
    title: 'Starlight Lullaby',
    emoji: '✨',
    desc: 'Melodi nada pentatonik berputar di bawah langit malam',
    tempo: 3400,
  },
];

// Track 1: Sweet Romance (Lofi Chords)
const romanceChords = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7 (C4, E4, G4, B4)
  [220.0, 261.63, 329.63, 392.0],   // Am7   (A3, C4, E4, G4)
  [174.61, 220.0, 261.63, 329.63],  // Fmaj7 (F3, A3, C4, E4)
  [196.0, 246.94, 293.66, 349.23],  // G7    (G3, B3, D4, F4)
];

// Track 2: Music Box Arpeggio (Celesta style)
const musicBoxPatterns = [
  [523.25, 659.25, 783.99, 1046.5], // C5, E5, G5, C6
  [493.88, 587.33, 783.99, 987.77], // B4, D5, G5, B5
  [440.0, 523.25, 659.25, 880.0],   // A4, C5, E5, A5
  [392.0, 493.88, 587.33, 783.99],  // G4, B4, D5, G5
];

// Track 3: Cozy Cafe Jazz
const cafeChords = [
  [146.83, 220.0, 261.63, 329.63], // Dm7 (D3, A3, C4, E4)
  [196.0, 246.94, 349.23, 440.0],  // G7add9 (G3, B3, F4, A4)
  [130.81, 196.0, 246.94, 329.63], // Cmaj7 (C3, G3, B3, E4)
  [220.0, 277.18, 329.63, 392.0],  // A7 (A3, C#4, E4, G4)
];

// Track 4: Starlight Lullaby
const starlightChords = [
  [369.99, 440.0, 554.37, 659.25], // F#m7
  [329.63, 392.0, 493.88, 587.33], // Em7
  [293.66, 369.99, 440.0, 554.37], // Dmaj7
  [440.0, 554.37, 659.25, 880.0],  // Aadd9
];

let chordStep = 0;

function playCurrentStep() {
  if (!isMusicPlaying) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const vol = Math.max(0.01, masterVolume);

    if (currentTrack === 'musicbox') {
      const notes = musicBoxPatterns[chordStep % musicBoxPatterns.length];
      chordStep++;

      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.22;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(vol * 0.12, noteTime + 0.03);
        gain.gain.linearRampToValueAtTime(0.0001, noteTime + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 1.65);
      });
    } else if (currentTrack === 'cafe') {
      const chord = cafeChords[chordStep % cafeChords.length];
      chordStep++;

      chord.forEach((freq, idx) => {
        const noteTime = now + idx * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(vol * 0.08, noteTime + 0.6);
        gain.gain.linearRampToValueAtTime(0.0001, noteTime + 3.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 3.5);
      });
    } else if (currentTrack === 'starlight') {
      const chord = starlightChords[chordStep % starlightChords.length];
      chordStep++;

      chord.forEach((freq, idx) => {
        const noteTime = now + idx * 0.15;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(vol * 0.07, noteTime + 0.5);
        gain.gain.linearRampToValueAtTime(0.0001, noteTime + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 3.3);
      });
    } else {
      // Default: Sweet Romance
      const chord = romanceChords[chordStep % romanceChords.length];
      chordStep++;

      chord.forEach((freq, idx) => {
        const noteTime = now + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(vol * 0.08, noteTime + 0.8);
        gain.gain.linearRampToValueAtTime(0.0001, noteTime + 3.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 3.8);
      });
    }
  } catch (err) {
    console.warn('playCurrentStep error:', err);
  }
}

function startMusicLoop() {
  if (musicInterval) clearInterval(musicInterval);
  const trackInfo = MUSIC_TRACKS.find((t) => t.id === currentTrack) || MUSIC_TRACKS[0];
  playCurrentStep();
  musicInterval = setInterval(playCurrentStep, trackInfo.tempo);
}

// Master Toggle
export function toggleAmbientMusic(onStateChange) {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (isMusicPlaying) {
    if (musicInterval) clearInterval(musicInterval);
    isMusicPlaying = false;
    notifyListeners();
    if (onStateChange) onStateChange(false);
    return false;
  }

  isMusicPlaying = true;
  startMusicLoop();
  notifyListeners();
  if (onStateChange) onStateChange(true);
  return true;
}

// Start explicitly
export function startMusic() {
  if (isMusicPlaying) return;
  toggleAmbientMusic();
}

// Stop explicitly (Mute)
export function stopMusic() {
  if (!isMusicPlaying) return;
  toggleAmbientMusic();
}

// Select Track
export function setMusicTrack(trackId) {
  currentTrack = trackId;
  savePrefs();
  chordStep = 0;
  if (isMusicPlaying) {
    try {
      startMusicLoop();
    } catch (e) {
      console.warn('Error starting music loop:', e);
    }
  }
  notifyListeners();
}

// Set Master Volume (0.0 to 1.0)
export function setMasterVolume(val) {
  masterVolume = Math.max(0, Math.min(1, val));
  savePrefs();
  notifyListeners();
}

// Toggle SFX
export function setSfxEnabled(val) {
  sfxEnabled = Boolean(val);
  savePrefs();
  notifyListeners();
}

export function getAudioPrefs() {
  return {
    isPlaying: isMusicPlaying,
    track: currentTrack,
    volume: masterVolume,
    sfxEnabled,
  };
}
