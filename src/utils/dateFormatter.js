export function formatDateIndo(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return {
      dayName,
      fullDate: `${day} ${monthName} ${year}`,
      formatted: `${dayName}, ${day} ${monthName} ${year}`,
      day,
      monthName,
      year,
    };
  } catch (e) {
    return { formatted: dateStr, day: '', monthName: '', year: '' };
  }
}

export function getDaysAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const target = new Date(dateStr);
  const diffTime = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Masa depan ✨';
  } else if (diffDays === 0) {
    return 'Hari ini 💖';
  } else if (diffDays === 1) {
    return 'Kemarin 🌸';
  } else if (diffDays < 30) {
    return `${diffDays} hari yang lalu`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan yang lalu`;
  } else {
    const years = (diffDays / 365).toFixed(1);
    return `${years} tahun yang lalu`;
  }
}
