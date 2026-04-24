import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { formatDateForDisplay, formatDateForInput } from '../utils/dateUtils';

const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  priority: z.enum(['low', 'medium', 'high']),
});

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(announcementSchema),
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/announcements', {
        params: {
          page,
          search,
          priority: priorityFilter,
          limit: 10,
        },
      });
      setAnnouncements(response.data.data);
      setTotal(response.data.totalItems);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page, priorityFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchAnnouncements();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (currentAnnouncement) {
        await api.put(`/announcements/admin/${currentAnnouncement._id}`, data);
        toast.success('Announcement updated successfully');
      } else {
        await api.post('/announcements/admin', data);
        toast.success('Announcement created successfully');
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/announcements/admin/${currentAnnouncement._id}`);
      toast.success('Announcement deleted successfully');
      setIsDeleteModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (announcement) => {
    setCurrentAnnouncement(announcement);
    reset({
      title: announcement.title,
      content: announcement.content,
      date: formatDateForInput(announcement.date),
      priority: announcement.priority,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentAnnouncement(null);
    reset({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (announcement) => {
    setCurrentAnnouncement(announcement);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Announcements</h1>
          <p className="text-slate-500 mt-1">Manage university news and notices.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center justify-center gap-2">
          <Plus size={20} />
          Create New
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or content..."
            className="input-field pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            className="input-field pl-12 appearance-none"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Announcement</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Priority</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-48 mb-2"></div><div className="h-3 bg-slate-50 dark:bg-slate-900 rounded w-full"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-20"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : announcements.length > 0 ? (
                announcements.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{item.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-1">{item.content}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{formatDateForDisplay(item.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        item.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                        item.priority === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                        'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(item)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => openDeleteModal(item)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={48} className="text-slate-200" />
                      <p className="text-slate-500">No announcements found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 10 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(page * 10, total)}</span> of <span className="font-semibold">{total}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={page * 10 >= total}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
            <input
              {...register('title')}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter announcement title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
              <input
                {...register('date')}
                type="date"
                className={`input-field ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
              <select
                {...register('priority')}
                className={`input-field ${errors.priority ? 'border-red-500' : ''}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content</label>
            <textarea
              {...register('content')}
              rows="4"
              className={`input-field ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Write the announcement content here..."
            ></textarea>
            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {currentAnnouncement ? 'Save Changes' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Announcement"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 flex gap-4">
            <AlertCircle className="text-red-600 shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-red-600">Are you sure?</h3>
              <p className="text-red-600/80 text-sm mt-1">
                This action cannot be undone. This will permanently delete the announcement 
                <span className="font-bold"> "{currentAnnouncement?.title}"</span>.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Announcements;
