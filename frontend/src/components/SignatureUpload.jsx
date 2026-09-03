import React, { useRef, useState } from 'react';
import { UploadCloud, X, FileCheck2 } from 'lucide-react';
import { toast } from 'sonner';

const SignatureUpload = ({ onFileSelect, initialPreview }) => {
  const [preview, setPreview] = useState(initialPreview || null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG and WEBP images are allowed');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileSelect(file);
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-5 text-center hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative inline-flex flex-col items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <img src={preview} alt="Signature Preview" className="max-h-28 object-contain rounded p-1 bg-white" />
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Signature attached</span>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition"
            title="Remove Signature"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-3"
        >
          <div className="p-3 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-full border border-sky-100 dark:border-sky-900 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200 font-semibold">Click to upload signature</div>
          <div className="text-xs text-slate-400 dark:text-slate-500">Supported: PNG, JPG, WEBP (Max 5MB)</div>
        </div>
      )}
    </div>
  );
};

export default SignatureUpload;
