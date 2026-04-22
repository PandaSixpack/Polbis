const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Announcement = require('./models/Announcement');
const Admin = require('./models/Admin');

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

const importData = async () => {
    try {
        await Announcement.deleteMany();
        await Admin.deleteMany();

        const createdAdmins = await Admin.insertMany(sampleAdmins);
        const adminId = createdAdmins[0]._id;

        const announcementsWithAdmin = sampleAnnouncements.map(announcement => ({
            ...announcement,
            createdBy: adminId
        }));

        await Announcement.insertMany(announcementsWithAdmin);

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
