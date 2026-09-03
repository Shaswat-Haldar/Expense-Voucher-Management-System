import React, { useEffect, useState } from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import VoucherTable from '../../components/VoucherTable';
import FilterPanel from '../../components/FilterPanel';

const AllVouchers = () => {
  const { getList } = useVouchers();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async (filters = {}) => {
    setLoading(true);
    const res = await getList({ ...filters, limit: 100 });
    if (res.success && res.data) {
      setVouchers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleFilter = (filters) => {
    fetchVouchers(filters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Accounts - All Vouchers</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Filter, review, and print approved expense vouchers.</p>
      </div>

      <FilterPanel onFilter={handleFilter} />

      {loading ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading vouchers...</div>
      ) : (
        <VoucherTable vouchers={vouchers} basePath="/accounts/vouchers" />
      )}
    </div>
  );
};

export default AllVouchers;
