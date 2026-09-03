import React, { useEffect, useState } from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowLeft, Edit3, XCircle } from 'lucide-react';

const VoucherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById } = useVouchers();
  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      const res = await getById(id);
      if (res.success) {
        setVoucher(res.data);
      }
    };
    fetchVoucher();
  }, [id, getById]);

  if (!voucher) return (
    <div className="flex items-center justify-center p-12 text-slate-500 dark:text-slate-400">
      Loading voucher details...
    </div>
  );

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
          <div className="flex items-center gap-3">
            <StatusBadge status={voucher.status} />
            {voucher.status === 'draft' && (
              <Link 
                to={`/employee/vouchers/${voucher.id}/edit`} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Draft
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <StatusTimeline currentStatus={voucher.status} />
      </div>

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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Expense Details
          </h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
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
            
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Status</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{voucher.status.replace('_', ' ')}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Claim Amount</span>
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

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Signatures
          </h3>
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                Your Signature
              </span>
              {voucher.employee_sig_path ? (
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl inline-block">
                  <img src={`${baseUrl}${voucher.employee_sig_path}`} alt="Employee Signature" className="h-16 max-w-full object-contain p-1 bg-white rounded" />
                </div>
              ) : (
                <span className="text-sm text-slate-400 italic">Not signed yet</span>
              )}
            </div>

            {(voucher.status === 'approved' || voucher.director_sig_path) && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                  Director Signature
                </span>
                {voucher.director_sig_path ? (
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl inline-block">
                    <img src={`${baseUrl}${voucher.director_sig_path}`} alt="Director Signature" className="h-16 max-w-full object-contain p-1 bg-white rounded" />
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 italic">Pending director signature</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetail;
