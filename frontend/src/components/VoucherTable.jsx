import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const VoucherTable = ({ vouchers, basePath = '/director/vouchers' }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <TableRow>
            <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Voucher No.</TableHead>
            <TableHead className="text-slate-600 dark:text-slate-300 font-semibold">Employee</TableHead>
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
                No vouchers found matching criteria.
              </TableCell>
            </TableRow>
          ) : (
            vouchers.map((v) => (
              <TableRow key={v.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/80">
                <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-200">{v.voucher_number}</TableCell>
                <TableCell className="font-medium text-slate-800 dark:text-slate-300">{v.employee_name}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{v.department}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{formatDate(v.expense_date)}</TableCell>
                <TableCell className="font-semibold text-slate-900 dark:text-white">{formatCurrency(v.amount)}</TableCell>
                <TableCell><StatusBadge status={v.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link 
                      to={`${basePath}/${v.id}`} 
                      className="p-2 text-slate-500 hover:text-[var(--color-primary)] dark:hover:text-sky-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="View Voucher"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VoucherTable;
