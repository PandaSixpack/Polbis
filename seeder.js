const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Announcement = require('./models/Announcement');
const Admin = require('./models/Admin');
const Achievement = require('./models/Achievement');
const Event = require('./models/Event');
const Program = require('./models/Program');

// Load env vars
dotenv.config();

// Connect to db
connectDB();

const sampleAdmins = [
  {
    "name": "Super Admin",
    "email": "admin@example.com",
    "password": "password123"
  }
];

const sampleAnnouncements = [
  { "title": "Pendaftaran Mahasiswa Baru Gelombang 2 Dibuka", "content": "Pendaftaran mahasiswa baru untuk tahun akademik 2026/2027 gelombang 2 telah dibuka. Dapatkan diskon biaya pendaftaran hingga 25% untuk pendaftar awal.", "date": "2026-04-10", "priority": "high" },
  { "title": "Beasiswa Prestasi Akademik 2026", "content": "Politeknik Bisnis Digital membuka program beasiswa prestasi akademik untuk mahasiswa berprestasi dengan nilai rata-rata minimal 3.5.", "date": "2026-04-08", "priority": "normal" },
  { "title": "Workshop Sertifikasi Internasional", "content": "Kesempatan mengikuti workshop dan mendapatkan sertifikasi internasional di bidang digital marketing, cloud computing, dan project management.", "date": "2026-04-05", "priority": "normal" },
  { "title": "Libur Idul Fitri 2026", "content": "Diberitahukan kepada seluruh mahasiswa bahwa perkuliahan diliburkan mulai tanggal 1-7 April 2026 dalam rangka menyambut Hari Raya Idul Fitri.", "date": "2026-03-28", "priority": "high" },
  { "title": "Lomba Inovasi Digital Mahasiswa", "content": "Tunjukkan kreativitasmu dalam ajang Lomba Inovasi Digital Mahasiswa (LIDM) 2026. Menangkan hadiah total puluhan juta rupiah.", "date": "2026-03-25", "priority": "low" },
  { "title": "Update Kurikulum 2026", "content": "Polbis University melakukan pembaharuan kurikulum pada program studi Bisnis Digital untuk menyesuaikan dengan kebutuhan industri terkini.", "date": "2026-03-20", "priority": "normal" },
  { "title": "Seminar Nasional Kewirausahaan", "content": "Ikuti seminar nasional bertajuk 'Building Scalable Startups' yang akan menghadirkan pembicara dari unicorn Indonesia.", "date": "2026-03-15", "priority": "normal" },
  { "title": "Open Recruitment Organisasi Mahasiswa", "content": "Pendaftaran pengurus baru BEM dan Himpunan Mahasiswa telah dibuka. Jadilah bagian dari perubahan kampus.", "date": "2026-03-10", "priority": "low" },
  { "title": "Ujian Tengah Semester Genap", "content": "Jadwal UTS Semester Genap tahun akademik 2025/2026 telah dirilis. Harap periksa portal mahasiswa masing-masing.", "date": "2026-03-05", "priority": "high" },
  { "title": "Pelatihan Soft Skill Mahasiswa", "content": "Pusat Karir Polbis mengadakan pelatihan komunikasi dan kepemimpinan untuk mahasiswa tingkat akhir.", "date": "2026-03-01", "priority": "normal" },
  { "title": "Bantuan Kuota Internet Kemendikbud", "content": "Pendataan ulang nomor ponsel mahasiswa untuk bantuan kuota internet periode April-Mei 2026.", "date": "2026-02-25", "priority": "normal" },
  { "title": "Kunjungan Industri ke Silicon Valley", "content": "Program studi menawarkan kunjungan industri pilihan ke perusahaan teknologi global bagi mahasiswa berprestasi.", "date": "2026-02-20", "priority": "low" },
  { "title": "Wisuda Polbis Angkatan ke-15", "content": "Pendaftaran wisuda periode Juni 2026 telah dibuka. Harap melengkapi dokumen persyaratan di biro akademik.", "date": "2026-02-15", "priority": "high" }
];

const sampleAchievements = [
  { "title": "Juara 1 Kompetisi Startup Nasional", "description": "Tim mahasiswa Bisnis Digital meraih juara pertama dalam kompetisi startup tingkat nasional.", "image": "https://images.unsplash.com/photo-1552664730-d307ca884978", "award": "Juara 1 Nasional", "date": "2026-03-01" },
  { "title": "Medali Emas Olimpiade Logistik", "description": "Mahasiswa Logistik Bisnis meraih medali emas dalam Olimpiade Logistik Asia Tenggara.", "image": "https://images.unsplash.com/photo-1553877522-43269d4ea984", "award": "Medali Emas", "date": "2026-02-01" },
  { "title": "Best Paper International Conference", "description": "Dosen dan mahasiswa Polbis meraih penghargaan Best Paper pada konferensi teknologi di Singapura.", "image": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4", "award": "Best Paper", "date": "2026-01-15" },
  { "title": "Top 5 Hackathon Global", "description": "Tim developer Polbis masuk dalam jajaran 5 besar pada ajang hackathon tingkat dunia yang disponsori Google.", "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", "award": "Finalist Top 5", "date": "2025-12-10" },
  { "title": "Penghargaan Kampus Digital Terbaik", "description": "Politeknik Bisnis Digital menerima penghargaan sebagai kampus dengan integrasi sistem digital terbaik tahun 2025.", "image": "https://images.unsplash.com/photo-1523050853063-bd8012fec4c8", "award": "Kampus Digital Terbaik", "date": "2025-11-20" },
  { "title": "Juara 2 Debat Bahasa Inggris", "description": "Unit Kegiatan Mahasiswa (UKM) Debat meraih juara kedua pada kompetisi debat antar perguruan tinggi se-Jawa.", "image": "https://images.unsplash.com/photo-1475721027785-f74ec0f77995", "award": "Juara 2 Regional", "date": "2025-10-05" },
  { "title": "Sertifikasi ISO 9001:2015", "description": "Polbis berhasil mempertahankan sertifikasi standar manajemen mutu internasional selama 5 tahun berturut-turut.", "image": "https://images.unsplash.com/photo-1454165833767-027ffea9e77b", "award": "Sertifikasi ISO", "date": "2025-09-12" },
  { "title": "Juara 1 Fotografi Lingkungan", "description": "Mahasiswa Desain Komunikasi Visual meraih juara utama dalam lomba foto bertema keberlanjutan alam.", "image": "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81", "award": "Juara 1 Nasional", "date": "2025-08-30" },
  { "title": "Penerima Hibah Penelitian Dikti", "description": "Kelompok peneliti dosen Polbis mendapatkan dana hibah penelitian untuk pengembangan AI di sektor UMKM.", "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d", "award": "Hibah Penelitian", "date": "2025-07-22" },
  { "title": "Juara 3 Business Plan Competition", "description": "Mahasiswa Akuntansi Digital merancang rencana bisnis ramah lingkungan dan meraih juara 3 di tingkat provinsi.", "image": "https://images.unsplash.com/photo-1552664730-d307ca884978", "award": "Juara 3 Provinsi", "date": "2025-06-15" },
  { "title": "Duta Inspiratif Kampus 2025", "description": "Penobatan mahasiswa teladan yang aktif dalam kegiatan sosial dan memiliki prestasi akademik gemilang.", "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", "award": "Duta Kampus", "date": "2025-05-10" },
  { "title": "Juara 1 E-Sport University League", "description": "Tim E-sport Polbis menjuarai liga Mobile Legends antar universitas se-Indonesia.", "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e", "award": "Juara 1 Nasional", "date": "2025-04-05" }
];

const sampleEvents = [
  { "title": "Workshop Digital Marketing Strategy", "description": "Pelatihan intensif tentang strategi pemasaran digital untuk meningkatkan brand awareness.", "date": "2026-03-15", "category": "Workshop", "image": "https://images.unsplash.com/photo-1552664730-d307ca884978" },
  { "title": "Seminar Teknologi AI dan Machine Learning", "description": "Menghadirkan praktisi industri untuk berbagi pengalaman implementasi AI dalam bisnis.", "date": "2026-03-22", "category": "Seminar", "image": "https://images.unsplash.com/photo-1591115765373-5207764f72e7" },
  { "title": "Career Fair Polbis 2026", "description": "Bursa kerja yang diikuti oleh lebih dari 50 perusahaan ternama di Indonesia.", "date": "2026-04-15", "category": "Other", "image": "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa" },
  { "title": "International Guest Lecture", "description": "Kuliah tamu oleh profesor dari University of Melbourne tentang ekonomi digital global.", "date": "2026-04-20", "category": "Seminar", "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655" },
  { "title": "Bootcamp Web Development", "description": "Pelatihan intensif membangun aplikasi web modern menggunakan React dan Node.js.", "date": "2026-05-01", "category": "Workshop", "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97" },
  { "title": "Polbis Innovation Summit", "description": "Konferensi tahunan untuk memamerkan karya inovasi mahasiswa dan dosen Polbis.", "date": "2026-05-10", "category": "Conference", "image": "https://images.unsplash.com/photo-1475721027785-f74ec0f77995" },
  { "title": "Hackathon 48 Hours", "description": "Kompetisi koding selama 48 jam nonstop untuk mencari solusi masalah transportasi kota.", "date": "2026-05-20", "category": "Competition", "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
  { "title": "Talkshow Literasi Keuangan", "description": "Pentingnya manajemen keuangan bagi generasi Z di era digital.", "date": "2026-05-25", "category": "Seminar", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd" },
  { "title": "Workshop Desain UI/UX", "description": "Belajar prinsip desain yang user-centric dan membuat prototype menggunakan Figma.", "date": "2026-06-05", "category": "Workshop", "image": "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c" },
  { "title": "Grand Alumni Homecoming", "description": "Pertemuan besar alumni Polbis dari semua angkatan untuk mempererat jejaring.", "date": "2026-06-15", "category": "Other", "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622" },
  { "title": "Lomba Debat Mahasiswa", "description": "Kompetisi adu argumen antar mahasiswa dengan topik isu-isukini di dunia teknologi.", "date": "2026-06-20", "category": "Competition", "image": "https://images.unsplash.com/photo-1475721027785-f74ec0f77995" },
  { "title": "Seminar Cyber Security", "description": "Melindungi aset digital dari ancaman serangan siber yang semakin kompleks.", "date": "2026-06-25", "category": "Seminar", "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b" }
];

const samplePrograms = [
  { "id": "bisnis-digital", "title": "Bisnis Digital", "description": "Program studi yang mempersiapkan mahasiswa menjadi profesional di bidang bisnis digital.", "highlights": ["Digital Marketing", "E-Commerce", "Business Analytics"], "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f", "link": "/hubungi", "curriculum": ["Fundamental Bisnis Digital", "SEO", "Project Management"], "careers": ["Digital Marketing Manager", "Business Analyst"] },
  { "id": "akuntansi-digital", "title": "Akuntansi Digital", "description": "Menggabungkan ilmu akuntansi tradisional dengan teknologi informasi modern.", "highlights": ["Cloud Accounting", "Financial Audit", "Tax Tech"], "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f", "link": "/hubungi", "curriculum": ["Sistem Informasi Akuntansi", "Data Analytics for Finance"], "careers": ["Digital Accountant", "Financial Controller"] },
  { "id": "logistik-bisnis", "title": "Logistik Bisnis", "description": "Manajemen rantai pasok dan distribusi barang secara efisien di era global.", "highlights": ["Supply Chain Management", "Warehouse System", "Export-Import"], "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d", "link": "/hubungi", "curriculum": ["Manajemen Transportasi", "Global Supply Chain"], "careers": ["Logistics Manager", "Supply Chain Planner"] },
  { "id": "manajemen-pemasaran", "title": "Manajemen Pemasaran", "description": "Strategi pemasaran kreatif dan analisis perilaku konsumen digital.", "highlights": ["Brand Strategy", "Content Marketing", "Market Research"], "image": "https://images.unsplash.com/photo-1533750349088-cd871a92f312", "link": "/hubungi", "curriculum": ["Consumer Behavior", "Digital Advertising"], "careers": ["Marketing Strategist", "Brand Manager"] },
  { "id": "teknologi-informasi", "title": "Teknologi Informasi", "description": "Pengembangan perangkat lunak dan infrastruktur jaringan komputer.", "highlights": ["Fullstack Development", "Network Security", "Cloud Computing"], "image": "https://images.unsplash.com/photo-1510511459019-5dda7724fd87", "link": "/hubungi", "curriculum": ["Algorithm & Data Structure", "Web Security"], "careers": ["Software Engineer", "Systems Architect"] },
  { "id": "desain-komunikasi-visual", "title": "Desain Komunikasi Visual", "description": "Kreativitas visual dalam menyampaikan pesan secara efektif melalui media digital.", "highlights": ["Graphic Design", "Motion Graphics", "Branding Visual"], "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5", "link": "/hubungi", "curriculum": ["Typography", "Digital Illustration"], "careers": ["Art Director", "UI/UX Designer"] },
  { "id": "hubungan-masyarakat", "title": "Hubungan Masyarakat", "description": "Membangun citra positif dan komunikasi strategis antar organisasi dan publik.", "highlights": ["Crisis Management", "Public Speaking", "Media Relations"], "image": "https://images.unsplash.com/photo-1521791136064-7986c2959d43", "link": "/hubungi", "curriculum": ["Strategic Communication", "Media Analytics"], "careers": ["PR Manager", "Corporate Communicator"] },
  { "id": "bisnis-internasional", "title": "Bisnis Internasional", "description": "Memahami dinamika perdagangan dan ekspansi bisnis ke pasar global.", "highlights": ["International Trade", "Cross-cultural Management", "Global Finance"], "image": "https://images.unsplash.com/photo-1454165833767-027ffea9e77b", "link": "/hubungi", "curriculum": ["Export Import Management", "Global Marketing"], "careers": ["International Business Consultant", "Trade Specialist"] },
  { "id": "perbankan-syariah", "title": "Perbankan Syariah", "description": "Prinsip keuangan berbasis syariah untuk mendukung ekonomi umat.", "highlights": ["Islamic Finance", "Sharia Audit", "Fintech Syariah"], "image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44", "link": "/hubungi", "curriculum": ["Fikih Muamalah", "Islamic Capital Market"], "careers": ["Sharia Banker", "Financial Advisor"] },
  { "id": "manajemen-sdm", "title": "Manajemen SDM", "description": "Pengembangan potensi manusia dalam organisasi secara profesional.", "highlights": ["Talent Acquisition", "Employee Training", "Organizational Development"], "image": "https://images.unsplash.com/photo-1521737711867-e3b97375f902", "link": "/hubungi", "curriculum": ["Human Capital Strategy", "Labor Law"], "careers": ["HR Manager", "People Development Specialist"] },
  { "id": "sistem-informasi-bisnis", "title": "Sistem Informasi Bisnis", "description": "Optimasi proses bisnis menggunakan solusi teknologi informasi.", "highlights": ["ERP Systems", "Data Warehousing", "IT Governance"], "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f", "link": "/hubungi", "curriculum": ["Business Process Reengineering", "Big Data Analytics"], "careers": ["Business Analyst", "IT Project Manager"] },
  { "id": "pariwisata-digital", "title": "Pariwisata Digital", "description": "Inovasi manajemen destinasi dan perhotelan berbasis teknologi.", "highlights": ["E-Tourism", "Hospitality Tech", "Event Management"], "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", "link": "/hubungi", "curriculum": ["Destination Marketing", "Digital Hospitality"], "careers": ["Tourism Consultant", "Hotel Manager"] }
];

const importData = async () => {
    try {
        await Announcement.deleteMany();
        await Admin.deleteMany();
        await Achievement.deleteMany();
        await Event.deleteMany();
        await Program.deleteMany();

        const createdAdmins = [];
        for (const adminData of sampleAdmins) {
            const admin = await Admin.create(adminData);
            createdAdmins.push(admin);
        }
        const adminId = createdAdmins[0]._id;

        const addAdminRef = (data) => data.map(item => ({ ...item, createdBy: adminId }));

        await Announcement.insertMany(addAdminRef(sampleAnnouncements));
        await Achievement.insertMany(addAdminRef(sampleAchievements));
        await Event.insertMany(addAdminRef(sampleEvents));
        await Program.insertMany(addAdminRef(samplePrograms));

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Announcement.deleteMany();
        await Admin.deleteMany();
        await Achievement.deleteMany();
        await Event.deleteMany();
        await Program.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
