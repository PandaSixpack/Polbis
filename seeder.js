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
  {
    "title": "Pendaftaran Mahasiswa Baru Gelombang 2 Dibuka",
    "content": "Pendaftaran mahasiswa baru untuk tahun akademik 2026/2027 gelombang 2 telah dibuka. Dapatkan diskon biaya pendaftaran hingga 25% untuk pendaftar awal.",
    "date": "2026-04-10",
    "priority": "high"
  },
  {
    "title": "Beasiswa Prestasi Akademik 2026",
    "content": "Politeknik Bisnis Digital membuka program beasiswa prestasi akademik untuk mahasiswa berprestasi dengan nilai rata-rata minimal 3.5.",
    "date": "2026-04-08",
    "priority": "normal"
  },
  {
    "title": "Workshop Sertifikasi Internasional",
    "content": "Kesempatan mengikuti workshop dan mendapatkan sertifikasi internasional di bidang digital marketing, cloud computing, dan project management.",
    "date": "2026-04-05",
    "priority": "normal"
  }
];

const sampleAchievements = [
  {
    "title": "Juara 1 Kompetisi Startup Nasional",
    "description": "Tim mahasiswa Bisnis Digital meraih juara pertama dalam kompetisi startup tingkat nasional.",
    "image": "https://images.unsplash.com/photo-1552664730-d307ca884978",
    "award": "Juara 1 Nasional",
    "date": "2026-03-01"
  },
  {
    "title": "Medali Emas Olimpiade Logistik",
    "description": "Mahasiswa Logistik Bisnis meraih medali emas dalam Olimpiade Logistik Asia Tenggara.",
    "image": "https://images.unsplash.com/photo-1553877522-43269d4ea984",
    "award": "Medali Emas",
    "date": "2026-02-01"
  }
];

const sampleEvents = [
  {
    "title": "Workshop Digital Marketing Strategy",
    "description": "Pelatihan intensif tentang strategi pemasaran digital untuk meningkatkan brand awareness dan penjualan online dengan praktik langsung.",
    "date": "15 Maret 2026",
    "category": "Workshop",
    "image": "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    "title": "Seminar Teknologi AI dan Machine Learning",
    "description": "Menghadirkan praktisi industri untuk berbagi pengalaman implementasi AI dalam bisnis modern dan tren teknologi terkini.",
    "date": "22 Maret 2026",
    "category": "Seminar",
    "image": "https://images.unsplash.com/photo-1591115765373-5207764f72e7"
  }
];

const samplePrograms = [
  {
    "id": "bisnis-digital",
    "title": "Bisnis Digital",
    "description": "Program studi yang mempersiapkan mahasiswa menjadi profesional di bidang bisnis digital.",
    "highlights": [
      "Digital Marketing",
      "E-Commerce",
      "Business Analytics"
    ],
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    "link": "/hubungi",
    "curriculum": [
      "Fundamental Bisnis Digital",
      "SEO",
      "Project Management"
    ],
    "careers": [
      "Digital Marketing Manager",
      "Business Analyst"
    ]
  }
];

const importData = async () => {
    try {
        await Announcement.deleteMany();
        await Admin.deleteMany();
        await Achievement.deleteMany();
        await Event.deleteMany();
        await Program.deleteMany();

        const createdAdmins = await Admin.insertMany(sampleAdmins);
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
