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
  BookOpen,
  X,
  ExternalLink
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import Modal from '../components/Modal';
import FileUpload from '../components/FileUpload';
import { fileToBase64 } from '../utils/imageUtils';
import toast from 'react-hot-toast';

const programSchema = z.object({
  id: z.string().min(3, 'ID is required (e.g. bisnis-digital)'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  link: z.string().optional(),
  highlights: z.array(z.object({ value: z.string() })),
  curriculum: z.array(z.object({ value: z.string() })),
  careers: z.array(z.object({ value: z.string() })),
});

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: {
      highlights: [{ value: '' }],
      curriculum: [{ value: '' }],
      careers: [{ value: '' }],
    }
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: "highlights" });
  const { fields: curriculumFields, append: appendCurriculum, remove: removeCurriculum } = useFieldArray({ control, name: "curriculum" });
  const { fields: careerFields, append: appendCareer, remove: removeCareer } = useFieldArray({ control, name: "careers" });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/programs', {
        params: { page, search, limit: 10 },
      });
      setPrograms(response.data.data);
      setTotal(response.data.totalItems);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPrograms();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Convert array of objects back to array of strings
      const payload = {
        ...data,
        highlights: data.highlights.map(h => h.value).filter(v => v !== ''),
        curriculum: data.curriculum.map(c => c.value).filter(v => v !== ''),
        careers: data.careers.map(c => c.value).filter(v => v !== ''),
      };

      if (selectedFile) {
        payload.image = await fileToBase64(selectedFile);
      } else if (currentProgram) {
        payload.image = currentProgram.image;
      }

      if (currentProgram) {
        await api.put(`/programs/admin/${currentProgram._id}`, payload);
        toast.success('Program updated successfully');
      } else {
        if (!selectedFile) {
          toast.error('Image is required for new program');
          setSubmitting(false);
          return;
        }
        await api.post('/programs/admin', payload);
        toast.success('Program created successfully');
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/programs/admin/${currentProgram._id}`);
      toast.success('Program deleted successfully');
      setIsDeleteModalOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (program) => {
    setCurrentProgram(program);
    setSelectedFile(null);
    setImagePreview(program.image);
    reset({
      id: program.id,
      title: program.title,
      description: program.description,
      link: program.link || '',
      highlights: program.highlights.map(v => ({ value: v })),
      curriculum: program.curriculum.map(v => ({ value: v })),
      careers: program.careers.map(v => ({ value: v })),
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentProgram(null);
    setSelectedFile(null);
    setImagePreview('');
    reset({
      id: '',
      title: '',
      description: '',
      link: '',
      highlights: [{ value: '' }],
      curriculum: [{ value: '' }],
      careers: [{ value: '' }],
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Academic Programs</h1>
          <p className="text-slate-500 mt-1">Manage degree programs and curriculum.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center justify-center gap-2">
          <Plus size={20} />
          Add Program
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search programs..."
          className="input-field pl-12"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-64" />
          ))
        ) : programs.length > 0 ? (
          programs.map((item) => (
            <div key={item._id} className="card group hover:border-primary-500/50 transition-all overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.id}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(item)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-primary-600 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => { setCurrentProgram(item); setIsDeleteModalOpen(true); }} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.careers.slice(0, 2).map((career, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                      {career}
                    </span>
                  ))}
                  {item.careers.length > 2 && <span className="text-[10px] text-slate-400">+{item.careers.length - 2} more</span>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full card p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <BookOpen size={48} className="text-slate-200" />
              <p className="text-slate-500">No programs found.</p>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentProgram ? 'Edit Program' : 'Add Program'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <FileUpload label="Program Cover Image" onFileSelect={handleFileSelect} preview={imagePreview} onClear={() => { setSelectedFile(null); setImagePreview(''); }} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Program ID (Slug)</label>
                <input {...register('id')} className={`input-field ${errors.id ? 'border-red-500' : ''}`} placeholder="e.g. bisnis-digital" disabled={!!currentProgram} />
                {errors.id && <p className="mt-1 text-sm text-red-500">{errors.id.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Program Title</label>
                <input {...register('title')} className={`input-field ${errors.title ? 'border-red-500' : ''}`} placeholder="e.g. Bachelor of Digital Business" />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Registration Link</label>
                <input {...register('link')} className="input-field" placeholder="/hubungi" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea {...register('description')} rows="4" className={`input-field ${errors.description ? 'border-red-500' : ''}`} placeholder="Program overview..." />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
              </div>
            </div>

            <div className="space-y-6">
              {/* Dynamic Arrays */}
              <DynamicArrayField label="Key Highlights" name="highlights" fields={highlightFields} append={() => appendHighlight({ value: '' })} remove={removeHighlight} register={register} />
              <DynamicArrayField label="Curriculum" name="curriculum" fields={curriculumFields} append={() => appendCurriculum({ value: '' })} remove={removeCurriculum} register={register} />
              <DynamicArrayField label="Career Paths" name="careers" fields={careerFields} append={() => appendCareer({ value: '' })} remove={removeCareer} register={register} />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {currentProgram ? 'Update Program' : 'Create Program'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Program">
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 flex gap-4 text-red-600">
            <AlertCircle size={24} />
            <p className="text-sm">Delete program <strong>{currentProgram?.title}</strong>? All associated data will be removed.</p>
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

const DynamicArrayField = ({ label, name, fields, append, remove, register }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</label>
      <button type="button" onClick={append} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
        <Plus size={14} /> Add
      </button>
    </div>
    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input {...register(`${name}.${index}.value`)} className="input-field py-1.5 text-sm" placeholder="Type here..." />
          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Programs;
