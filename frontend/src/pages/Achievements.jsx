import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Trophy,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import Modal from '../components/Modal';
import FileUpload from '../components/FileUpload';
import { fileToBase64 } from '../utils/imageUtils';
import { formatDateForDisplay, formatDateForInput } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const achievementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  award: z.string().min(1, 'Award name is required'),
  date: z.string().min(1, 'Date is required'),
  image: z.any().optional(),
});

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(achievementSchema),
  });

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/achievements', {
        params: { page, search, limit: 10 },
      });
      setAchievements(response.data.data);
      setTotal(response.data.totalItems);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchAchievements();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { ...data };
      if (selectedFile) {
        payload.image = await fileToBase64(selectedFile);
      } else if (currentAchievement) {
        payload.image = currentAchievement.image;
      }

      if (currentAchievement) {
        await api.put(`/achievements/admin/${currentAchievement._id}`, payload);
        toast.success('Achievement updated successfully');
      } else {
        if (!selectedFile) {
          toast.error('Image is required for new achievement');
          setSubmitting(false);
          return;
        }
        await api.post('/achievements/admin', payload);
        toast.success('Achievement created successfully');
      }
      setIsModalOpen(false);
      fetchAchievements();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/achievements/admin/${currentAchievement._id}`);
      toast.success('Achievement deleted successfully');
      setIsDeleteModalOpen(false);
      fetchAchievements();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (achievement) => {
    setCurrentAchievement(achievement);
    setSelectedFile(null);
    setImagePreview(achievement.image);
    reset({
      title: achievement.title,
      description: achievement.description,
      award: achievement.award,
      date: formatDateForInput(achievement.date),
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentAchievement(null);
    setSelectedFile(null);
    setImagePreview('');
    reset({
      title: '',
      description: '',
      award: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Achievements</h1>
          <p className="text-slate-500 mt-1">Manage university awards and recognitions.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center justify-center gap-2">
          <Plus size={20} />
          Add Achievement
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search achievements..."
          className="input-field pl-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-80">
              <div className="h-48 bg-slate-100 dark:bg-slate-800" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-50 dark:bg-slate-900 rounded w-full" />
              </div>
            </div>
          ))
        ) : achievements.length > 0 ? (
          achievements.map((item) => (
            <div key={item._id} className="card group hover:border-primary-500/50 transition-all flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(item)} className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-primary-600 shadow-lg backdrop-blur-sm">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => { setCurrentAchievement(item); setIsDeleteModalOpen(true); }} className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 text-red-600 hover:bg-red-50 shadow-lg backdrop-blur-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-primary-600/90 text-white text-xs font-bold backdrop-blur-sm">
                  {item.award}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <CalendarIcon size={14} />
                  {formatDateForDisplay(item.date)}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 flex-1">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full card p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <Trophy size={48} className="text-slate-200" />
              <p className="text-slate-500">No achievements found.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 10 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(page * 10, total)}</span> of <span className="font-semibold">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={page * 10 >= total}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAchievement ? 'Edit Achievement' : 'Add Achievement'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FileUpload label="Achievement Image" onFileSelect={handleFileSelect} preview={imagePreview} onClear={() => { setSelectedFile(null); setImagePreview(''); }} />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
            <input {...register('title')} className={`input-field ${errors.title ? 'border-red-500' : ''}`} placeholder="Achievement title" />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Award Name</label>
              <input {...register('award')} className={`input-field ${errors.award ? 'border-red-500' : ''}`} placeholder="e.g. Gold Medal" />
              {errors.award && <p className="mt-1 text-sm text-red-500">{errors.award.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
              <input {...register('date')} type="date" className={`input-field ${errors.date ? 'border-red-500' : ''}`} />
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
            <textarea {...register('description')} rows="4" className={`input-field ${errors.description ? 'border-red-500' : ''}`} placeholder="Tell us more about this achievement..." />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {currentAchievement ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Achievement">
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 flex gap-4 text-red-600">
            <AlertCircle size={24} />
            <p className="text-sm">Are you sure you want to delete this achievement? This action cannot be undone.</p>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
            <button onClick={handleDelete} disabled={submitting} className="flex-1 bg-red-600 text-white rounded-xl font-medium">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Achievements;
