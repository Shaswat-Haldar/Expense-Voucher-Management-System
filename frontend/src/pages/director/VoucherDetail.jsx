import React, { useState, useEffect } from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/button';
import SignatureUpload from '../../components/SignatureUpload';
import RejectDialog from '../../components/RejectDialog';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const VoucherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, approve, reject, uploadSig, loading } = useVouchers();
  const [voucher, setVoucher] = useState(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [directorSig, setDirectorSig] = useState(null);

  const fetchVoucher = async () => {
    const res = await getById(id);
    if (res.success) {
      setVoucher(res.data);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, [id, getById]);

  const handleApprove = async () => {
    // 1. Upload signature first if it's new
    if (directorSig) {
      const sigRes = await uploadSig(id, 'director', directorSig);
      if (!sigRes.success) return;
    } else if (!voucher.director_sig_path) {
      toast.error('Signature is required to approve');
      return;
    }

    // 2. Approve
    const res = await approve(id);
    if (res.success) {
      toast.success('Voucher approved successfully');
      navigate('/director/approvals');
    }
  };

  const handleReject = async (reason) => {
    const res = await reject(id, reason);
    if (res.success) {
      toast.success('Voucher rejected successfully');
      setIsRejectOpen(false);
      navigate('/director/approvals');
    }
  };

  if (!voucher) return (
    <div className="flex items-center justify-center p-12 text-slate-500 dark:text-slate-400">
      Loading voucher details...
    </div>
  );

  // Strip /api suffix so image paths like /uploads/... resolve correctly
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
  const baseUrl = apiBase.replace(/\/api\/?$/, '');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{voucher.expense_title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Voucher No: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{voucher.voucher_number}</span></p>
          </div>
          <StatusBadge status={voucher.status} />
        </div>
      </div>

      {/* Timeline Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <StatusTimeline currentStatus={voucher.status} />
      </div>

      {/* Rejection Alert Box */}
      {voucher.status === 'rejected' && voucher.rejection_reason && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 rounded-xl">
          <h3 className="text-red-800 dark:text-red-300 font-bold text-sm mb-1 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            Rejection Reason
          </h3>
          <p className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap">{voucher.rejection_reason}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Expense Details Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Expense Details
          </h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Employee</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{voucher.employee_name}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Department</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{voucher.department}</span>
            </div>
            
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Category</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{voucher.expense_category}</span>
            </div>
            
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Expense Date</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(voucher.expense_date)}</span>
            </div>
            
            <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Total Claim Amount</span>
              <span className="font-bold text-2xl text-[var(--color-primary)] dark:text-sky-400">{formatCurrency(voucher.amount)}</span>
            </div>
          </div>
          
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Description</span>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {voucher.expense_description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Signatures & Actions Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              Signatures & Approval
            </h3>
            
            <div className="space-y-5">
              <div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Employee Signature
                </span>
                {voucher.employee_sig_path ? (
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl inline-block">
                    <img src={`${baseUrl}${voucher.employee_sig_path}`} alt="Employee Signature" className="h-16 max-w-full object-contain p-1 bg-white rounded" />
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 italic">Not signed</span>
                )}
              </div>

              {voucher.status === 'pending_approval' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                    Director Signature <span className="text-red-500">*</span>
                  </span>
                  {voucher.director_sig_path && !directorSig ? (
                    <div className="space-y-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl inline-block">
                        <img src={`${baseUrl}${voucher.director_sig_path}`} alt="Director Signature" className="h-16 max-w-full object-contain p-1 bg-white rounded" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signature already on file. You can approve or attach a new signature below.</p>
                      <SignatureUpload onFileSelect={setDirectorSig} />
                    </div>
                  ) : (
                    <SignatureUpload onFileSelect={setDirectorSig} />
                  )}
                </div>
              )}
              
              {voucher.status !== 'pending_approval' && voucher.director_sig_path && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                    Director Signature
                  </span>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl inline-block">
                    <img src={`${baseUrl}${voucher.director_sig_path}`} alt="Director Signature" className="h-16 max-w-full object-contain p-1 bg-white rounded" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {voucher.status === 'pending_approval' && (
            <div className="flex gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
              <Button 
                variant="outline"
                onClick={() => setIsRejectOpen(true)}
                disabled={loading}
                className="flex-1 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700"
              >
                Reject Voucher
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={loading || (!directorSig && !voucher.director_sig_path)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                {loading ? 'Approving...' : 'Approve Voucher'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <RejectDialog 
        isOpen={isRejectOpen} 
        onClose={() => setIsRejectOpen(false)} 
        onConfirm={handleReject}
        loading={loading}
      />
    </div>
  );
};

export default VoucherDetail;
