import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { FileText, Edit, Clock, CheckCircle, XCircle, IndianRupee, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</CardTitle>
      <div className={`p-2 rounded-xl ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
    </CardContent>
  </Card>
);

const EmployeeDashboard = () => {
  const { data: { stats }, loading } = useDashboard();

  if (loading) return (
    <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading dashboard...</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Employee Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track your personal expense claims and submission status.</p>
        </div>
        <Link 
          to="/employee/vouchers/new" 
          className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] dark:bg-sky-500 hover:bg-[var(--color-primary-lt)] dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Voucher
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Submitted" value={stats?.total || 0} icon={FileText} colorClass="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
        <StatCard title="Total Claimed" value={formatCurrency(stats?.total_amount || 0)} icon={IndianRupee} colorClass="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40" />
        <StatCard title="Drafts" value={stats?.draft || 0} icon={Edit} colorClass="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400" />
        <StatCard title="Pending Approval" value={stats?.pending || 0} icon={Clock} colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40" />
        <StatCard title="Approved" value={stats?.approved || 0} icon={CheckCircle} colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40" />
        <StatCard title="Rejected" value={stats?.rejected || 0} icon={XCircle} colorClass="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40" />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
