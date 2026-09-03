import React, { useEffect, useState } from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import VoucherTable from '../../components/VoucherTable';

const AllVouchers = () => {
  const { getList } = useVouchers();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      const res = await getList({ limit: 100 });
      if (res.success && res.data) {
        setVouchers(Array.isArray(res.data) ? res.data : (res.data.data || []));
      }
      setLoading(false);
    };
    fetchVouchers();
  }, [getList]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">All Vouchers</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive audit trail of all company expense claims.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading vouchers...</div>
      ) : (
        <VoucherTable vouchers={vouchers} basePath="/director/vouchers" />
      )}
    </div>
  );
};

export default AllVouchers;
