import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'memories.json');
const TMP_DB_FILE = path.join('/tmp', 'memories.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {}

// Multer Storage for Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `memory-${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (process.env.VERCEL) {
  app.use('/uploads', express.static(UPLOADS_DIR));
}

// Initial cute sample data
const sampleMemories = [
  {
    id: 'sample-1',
    date: '2023-08-14',
    title: 'Pertama Kali Ketemu di Cafe ☕✨',
    description: 'Masih inget banget pas kamu nervous numpahin sedikit kopi, terus kita berdua malah ketawa bareng. Momen pertama yang bikin deg-degan tapi manis banget!',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    author: 'Kamu & Aku',
    frame: 'polaroid',
    mood: '🥰 Romantis',
    stickers: ['🌸', '✨', '☕'],
    likes: 12,
    createdAt: new Date('2023-08-14T10:00:00Z').toISOString(),
  },
  {
    id: 'sample-2',
    date: '2023-11-20',
    title: 'Piknik Sore di Bawah Pohon Rindang 🧺🍓',
    description: 'Kita bawa bekal sandwich bikinan sendiri sama stroberi manis. Udaranya adem banget, kita ngobrolin masa depan sampe lupa waktu pas matahari terbenam.',
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    author: 'Si Manis',
    frame: 'floral',
    mood: '🌸 Bahagia',
    stickers: ['🍓', '🎀', '🧺'],
    likes: 19,
    createdAt: new Date('2023-11-20T16:30:00Z').toISOString(),
  },
  {
    id: 'sample-3',
    date: '2024-02-14',
    title: 'Bunga Mawar & Senyum Manismu 🌹💐',
    description: 'Hari kasih sayang bareng kamu. Matamu berbinar-binar pas nerima buket mawar ini. Bener-bener hari terindah yang selalu pengen diulang.',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    author: 'My Love',
    frame: 'gold',
    mood: '✨ Spesial',
    stickers: ['🌹', '💖', '👑'],
    likes: 27,
    createdAt: new Date('2024-02-14T19:00:00Z').toISOString(),
  },
  {
    id: 'sample-4',
    date: '2024-07-05',
    title: 'Sunset Pantai & Pasir Putih 🏖️🌅',
    description: 'Jalan santai di pinggir pantai sambil denger deburan ombak dan angin sepoi-sepoi. Langitnya warna pink keemasan, persis kaya cerita dongeng!',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    author: 'Explorer Kita',
    frame: 'filmstrip',
    mood: '🏖️ Liburan',
    stickers: ['🌊', '🌅', '🐚'],
    likes: 21,
    createdAt: new Date('2024-07-05T17:45:00Z').toISOString(),
  },
];

// Helper to read database
function getMemories() {
  if (process.env.VERCEL && fs.existsSync(TMP_DB_FILE)) {
    try {
      const raw = fs.readFileSync(TMP_DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {}
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading DB:', err);
    }
  }
  return sampleMemories;
}

// Helper to save database
function saveMemories(memories) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memories, null, 2), 'utf-8');
  } catch (err) {
    if (process.env.VERCEL) {
      try {
        fs.writeFileSync(TMP_DB_FILE, JSON.stringify(memories, null, 2), 'utf-8');
      } catch (e) {}
    } else {
      console.error('Error writing DB:', err);
    }
  }
}

// Initialize file if needed
getMemories();

// API: Get all memories
app.get('/api/memories', (req, res) => {
  const memories = getMemories();
  const sort = req.query.sort || 'asc'; // 'asc' = tertua ke terbaru (kronologis), 'desc' = terbaru ke tertua
  
  const sorted = [...memories].sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return sort === 'desc' ? dateB - dateA : dateA - dateB;
  });

  res.json({
    success: true,
    count: sorted.length,
    data: sorted,
  });
});

// API: Add memory (supports file upload or image URL)
app.post('/api/memories', upload.single('imageFile'), (req, res) => {
  try {
    const {
      title,
      description,
      date,
      author,
      frame,
      mood,
      stickers,
      imageUrl: customUrl,
    } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Tanggal wajib diisi!' });
    }

    let finalImageUrl = '';

    if (req.file) {
      // Local uploaded image
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (customUrl && customUrl.trim()) {
      finalImageUrl = customUrl.trim();
    } else {
      return res.status(400).json({ success: false, message: 'Pilih foto atau masukkan link foto!' });
    }

    let parsedStickers = ['🌸', '✨'];
    if (stickers) {
      try {
        parsedStickers = typeof stickers === 'string' ? JSON.parse(stickers) : stickers;
      } catch (e) {
        parsedStickers = ['🌸', '✨'];
      }
    }

    const newMemory = {
      id: `mem-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      date: date.trim(),
      title: title ? title.trim() : 'Momen Manis',
      description: description ? description.trim() : '',
      imageUrl: finalImageUrl,
      author: author ? author.trim() : 'Anonim',
      frame: frame || 'polaroid',
      aspectRatio: req.body.aspectRatio || '4:3',
      mood: mood || '🥰 Romantis',
      stickers: parsedStickers,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    const memories = getMemories();
    memories.push(newMemory);
    saveMemories(memories);

    res.status(201).json({
      success: true,
      message: 'Foto kenangan berhasil ditambahkan! 🌸',
      data: newMemory,
    });
  } catch (error) {
    console.error('Error adding memory:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan foto kenangan.' });
  }
});

// API: Like or Unlike a memory
app.post('/api/memories/:id/like', (req, res) => {
  const { id } = req.params;
  const { action } = req.body || {};
  const memories = getMemories();
  const target = memories.find((m) => m.id === id);

  if (!target) {
    return res.status(404).json({ success: false, message: 'Kenangan tidak ditemukan' });
  }

  if (action === 'unlike') {
    target.likes = Math.max(0, (target.likes || 0) - 1);
  } else {
    target.likes = (target.likes || 0) + 1;
  }
  saveMemories(memories);

  res.json({ success: true, likes: target.likes, action: action || 'like' });
});

// API: Delete a memory
app.delete('/api/memories/:id', (req, res) => {
  const { id } = req.params;
  const memories = getMemories();
  const index = memories.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Kenangan tidak ditemukan' });
  }

  const removed = memories.splice(index, 1)[0];

  // If file was in uploads, remove local file optionally
  if (removed.imageUrl && removed.imageUrl.startsWith('/uploads/')) {
    const filename = path.basename(removed.imageUrl);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Could not delete file:', e);
      }
    }
  }

  saveMemories(memories);
  res.json({ success: true, message: 'Kenangan berhasil dihapus' });
});

// API: Stats & Journey info
app.get('/api/stats', (req, res) => {
  const memories = getMemories();
  if (memories.length === 0) {
    return res.json({
      total: 0,
      earliestDate: null,
      latestDate: null,
      totalDays: 0,
    });
  }

  const sortedDates = memories
    .map((m) => new Date(m.date).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => a - b);

  const earliest = sortedDates[0] ? new Date(sortedDates[0]).toISOString().split('T')[0] : null;
  const latest = sortedDates[sortedDates.length - 1] ? new Date(sortedDates[sortedDates.length - 1]).toISOString().split('T')[0] : null;
  
  const diffTime = sortedDates.length > 1 ? Math.abs(sortedDates[sortedDates.length - 1] - sortedDates[0]) : 0;
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  res.json({
    total: memories.length,
    earliestDate: earliest,
    latestDate: latest,
    totalDays,
  });
});

// Serve frontend build if available (production mode)
const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Sweet Moments Server running on http://localhost:${PORT}`);
  });
}

export default app;
