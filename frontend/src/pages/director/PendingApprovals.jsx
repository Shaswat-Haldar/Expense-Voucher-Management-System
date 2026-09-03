import React, { useEffect, useState } from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import VoucherTable from '../../components/VoucherTable';
import { Search } from 'lucide-react';

const PendingApprovals = () => {
  const { getList } = useVouchers();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVouchers = async (search = '') => {
    setLoading(true);
    const params = { status: 'pending_approval', limit: 100 };
    if (search) {
      params.voucher_number = search;
    }
    const res = await getList(params);
    if (res.success && res.data) {
      setVouchers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVouchers(searchTerm);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pending Approvals</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Vouchers awaiting Director signature and decision.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <form onSubmit={handleSearch} className="max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Voucher No. (e.g. EXP-202609)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lt)] dark:focus:ring-sky-500"
            />
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-medium text-sm hover:bg-slate-800 dark:hover:bg-sky-400 transition"
          >
            Search
          </button>
          {searchTerm && (
            <button 
              type="button" 
              onClick={() => { setSearchTerm(''); fetchVouchers(''); }}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading pending vouchers...</div>
      ) : (
        <VoucherTable vouchers={vouchers} basePath="/director/vouchers" />
      )}
    </div>
  );
};

export default PendingApprovals;
