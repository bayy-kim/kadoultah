// ============================================================
// ✏️ FILE INI BERISI SEMUA KONTEN YANG BISA KAMU EDIT
// Ganti nama, teks surat, path foto, dan path musik di sini.
// ============================================================

// ✏️ GANTI DI SINI — Nama orang yang berulang tahun
export const BIRTHDAY_NAME = "yeshi";

// ✏️ GANTI DI SINI — Tahun lahir (untuk menghitung umur, opsional)
export const BIRTH_YEAR = 2000;

// ✏️ GANTI DI SINI — Warna tema utama (HSL hue, 0-360)
// 340 = soft pink/rose, 270 = ungu, 200 = biru, 0 = merah
export const THEME_HUE = 340;

// ✏️ GANTI DI SINI — Teks di intro section
export const INTRO_SUBTITLE = "Semoga hari ini penuh kebahagiaan ✨";

// ✏️ GANTI DI SINI — Teks-teks di Journey section (muncul satu per satu)
export const JOURNEY_TEXTS = [
  {
    title: "Kenangan Pertama",
    description: "Hari di mana kita pertama kali bertemu, dan senyummu mengubah segalanya.",
  },
  {
    title: "Petualangan Kita",
    description: "Setiap momen bersamamu adalah petualangan yang tak terlupakan.",
  },
  {
    title: "Tawa & Canda",
    description: "Tawamu adalah melodi terindah yang pernah kudengar.",
  },
  {
    title: "Hari Ini",
    description: "Dan hari ini, aku ingin kamu tahu betapa berartinya kamu.",
  },
];

// ✏️ GANTI DI SINI — Warna placeholder & file foto untuk 3D photo frames
// Taruh file foto Anda di folder public/photos/ lalu sesuaikan nama filenya.
// Jika image tidak diisi (null/empty), maka frame akan otomatis menggunakan warna solid.
export const PHOTO_FRAMES = [
  { image: "/photos/foto1.jpg", color: "#7c3aed", label: "Foto 1" },
  { image: "/photos/foto2.jpg", color: "#ec4899", label: "Foto 2" },
  { image: "/photos/foto3.jpg", color: "#06b6d4", label: "Foto 3" },
  { image: "/photos/foto4.jpg", color: "#f59e0b", label: "Foto 4" },
  { image: "/photos/foto5.jpg", color: "#10b981", label: "Foto 5" },
];

// ✏️ GANTI DI SINI — Teks harapan setelah tiup lilin
export const WISH_TEXT = "Semoga semua harapan dan impianmu terwujud! 🎂🎉";

// ✏️ GANTI DI SINI — Isi surat lengkap (gunakan \n untuk paragraf baru)
export const LETTER_TEXT = `Untuk kamu yang paling spesial,

Selamat ulang tahun! 🎉

Di hari yang istimewa ini, aku ingin kamu tahu bahwa kehadiranmu di hidupku adalah hadiah terbesar yang pernah aku terima. Setiap hari bersamamu terasa seperti petualangan baru yang penuh warna.

Terima kasih sudah selalu ada, sudah selalu menjadi tempat ternyaman untuk pulang. Terima kasih untuk setiap senyuman yang kamu berikan, untuk setiap kata-kata penyemangat, dan untuk setiap momen indah yang telah kita lalui bersama.

Aku mendoakan yang terbaik untukmu. Semoga tahun ini membawa lebih banyak kebahagiaan, kesuksesan, dan kesehatan. Semoga setiap impianmu tercapai dan setiap langkahmu diberkati.

Kamu adalah orang yang luar biasa, dan aku sangat bersyukur bisa mengenalmu. Jangan pernah lupa bahwa kamu dicintai, dihargai, dan sangat berarti.

Sekali lagi, selamat ulang tahun! Semoga hari ini penuh dengan cinta, tawa, dan kebahagiaan.

Dengan penuh cinta,
[Nama Pengirim] 💕`;

// ✏️ GANTI DI SINI — Path file musik latar
// Taruh file musik di folder public/music/ lalu update path-nya
// Contoh: "/music/lagu-ulang-tahun.mp3"
export const AUDIO_SRC = "/music/background-music.mp3";

// ✏️ GANTI DI SINI — Judul lagu yang tampil di audio player
export const AUDIO_TITLE = "Lagu Untuk Kamu ♪";
