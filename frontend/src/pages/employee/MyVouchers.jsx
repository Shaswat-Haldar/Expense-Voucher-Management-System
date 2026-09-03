import React, { useEffect, useState } from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import DeleteConfirmDialog from '../../components/DeleteConfirmDialog';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const MyVouchers = () => {
  const { getList, remove, loading } = useVouchers();
  const [vouchers, setVouchers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchVouchers = async () => {
    const res = await getList({ limit: 50 });
    if (res.success && res.data) {
      setVouchers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await remove(deleteId);
    if (res.success) {
      toast.success('Voucher deleted successfully');
      setDeleteId(null);
      fetchVouchers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Vouchers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage and track your submitted expense claims.</p>
        </div>
        <Link 
          to="/employee/vouchers/new" 
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] dark:bg-sky-500 hover:bg-[var(--color-primary-lt)] dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Voucher
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <TableRow>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Voucher No.</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Title</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Department</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Date</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Amount</TableHead>
              <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Status</TableHead>
              <TableHead className="text-right text-slate-600 dark:text-slate-300 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400 dark:text-slate-500">
                  No vouchers found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              vouchers.map((v) => (
                <TableRow key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/80">
                  <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-200">{v.voucher_number}</TableCell>
                  <TableCell className="font-medium text-slate-800 dark:text-slate-300">{v.expense_title}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{v.department}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{formatDate(v.expense_date)}</TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-white">{formatCurrency(v.amount)}</TableCell>
                  <TableCell><StatusBadge status={v.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link 
                        to={`/employee/vouchers/${v.id}`} 
                        className="p-2 text-slate-500 hover:text-[var(--color-primary)] dark:hover:text-sky-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="View Voucher"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {v.status === 'draft' && (
                        <>
                          <Link 
                            to={`/employee/vouchers/${v.id}/edit`} 
                            className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-sky-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit Draft"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => setDeleteId(v.id)} 
                            className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default MyVouchers;
