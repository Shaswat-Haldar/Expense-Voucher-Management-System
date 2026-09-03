import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import SignatureUpload from './SignatureUpload';
import { cn } from '../utils';
import { AlertCircle, Send, Save } from 'lucide-react';

const voucherSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  expense_title: z.string().min(1, 'Title is required'),
  expense_category: z.string().default('General'),
  expense_date: z.string().min(1, 'Expense Date is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  expense_description: z.string().optional(),
});

const VoucherForm = ({ initialData, onSubmitDraft, onSubmitFinal, loading }) => {
  const [signatureFile, setSignatureFile] = useState(null);
  const [shake, setShake] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      department: initialData?.department || '',
      expense_title: initialData?.expense_title || '',
      expense_category: initialData?.expense_category || 'General',
      expense_date: initialData?.expense_date ? new Date(initialData.expense_date).toISOString().split('T')[0] : '',
      amount: initialData?.amount || '',
      expense_description: initialData?.expense_description || '',
    }
  });

  const handleDraft = (data) => {
    onSubmitDraft(data);
  };

  const handleFinal = (data) => {
    if (!signatureFile && !initialData?.employee_sig_path) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onSubmitFinal(data, signatureFile);
  };

  const inputClasses = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lt)] dark:focus:ring-sky-500 transition";

  return (
    <form className="space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl transition-colors">
      <div className="space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Section 1: Expense Details</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enter the required details about your expenditure.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              {...register('expense_title')} 
              className={inputClasses} 
              placeholder="e.g. Client Lunch at Oberoi Hotel" 
            />
            {errors.expense_title && <p className="text-red-500 text-xs mt-1">{errors.expense_title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <select {...register('department')} className={inputClasses}>
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select {...register('expense_category')} className={inputClasses}>
              <option value="General">General</option>
              <option value="Travel">Travel</option>
              <option value="Meals">Meals</option>
              <option value="Supplies">Supplies</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Date <span className="text-red-500">*</span>
            </label>
            <input type="date" {...register('expense_date')} className={inputClasses} />
            {errors.expense_date && <p className="text-red-500 text-xs mt-1">{errors.expense_date.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Amount (₹ INR) <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              step="0.01" 
              {...register('amount')} 
              className={inputClasses} 
              placeholder="0.00" 
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Justification
            </label>
            <textarea 
              {...register('expense_description')} 
              rows="3" 
              className={inputClasses} 
              placeholder="Provide context or purpose for this corporate expenditure..." 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Section 2: Employee Signature</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Attach your signature to certify this claim. You can save a draft without a signature.</p>
        </div>
        
        <SignatureUpload 
          onFileSelect={setSignatureFile} 
          initialPreview={initialData?.employee_sig_path ? `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')}${initialData.employee_sig_path}` : null}
        />
        
        {shake && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Signature is required to submit for approval! Please attach your signature above.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleSubmit(handleDraft)}
          disabled={loading}
          className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit(handleFinal)}
          disabled={loading}
          className={cn(
            "flex-1 bg-[var(--color-primary)] dark:bg-sky-500 hover:bg-[var(--color-primary-lt)] dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold shadow-sm transition", 
            shake && "animate-[shake_0.5s_ease-in-out]"
          )}
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Submitting...' : 'Submit for Approval'}
        </Button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
        }
      `}} />
    </form>
  );
};

export default VoucherForm;
