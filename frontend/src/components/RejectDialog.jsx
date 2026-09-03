import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from 'sonner';

const RejectDialog = ({ isOpen, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      toast.error('Rejection reason must be at least 10 characters long');
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setReason('');
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
            Reject Voucher
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300">
            Please provide a clear reason for rejecting this voucher. This comment will be visible to the submitting employee.
          </DialogDescription>
        </DialogHeader>
        <div className="py-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Rejection Reason (min 10 characters) <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm shadow-inner transition"
            rows="4"
            placeholder="Explain why this voucher is rejected..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-between items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Minimum 10 characters required</span>
            <span className={reason.trim().length >= 10 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}>
              {reason.trim().length} chars
            </span>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={loading || reason.trim().length < 10}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {loading ? 'Rejecting...' : 'Reject Voucher'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
