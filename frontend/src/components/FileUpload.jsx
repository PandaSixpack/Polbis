import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { compressImage } from '../utils/imageUtils';
import toast from 'react-hot-toast';

const FileUpload = ({ label, onFileSelect, preview, onClear }) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsCompressing(true);
    try {
      const compressedFile = await compressImage(file);
      onFileSelect(compressedFile);
      toast.success('Image compressed successfully');
    } catch (error) {
      toast.error('Failed to compress image');
      console.error(error);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      
      <div className="relative group">
        {preview ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${isCompressing ? 'pointer-events-none opacity-50' : ''}`}
          >
            {isCompressing ? (
              <>
                <Loader2 className="animate-spin text-primary-600" size={32} />
                <p className="text-sm font-medium text-slate-500">Compressing image...</p>
              </>
            ) : (
              <>
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                  <Upload className="text-slate-400 group-hover:text-primary-600" size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Click to upload</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                </div>
              </>
            )}
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default FileUpload;
