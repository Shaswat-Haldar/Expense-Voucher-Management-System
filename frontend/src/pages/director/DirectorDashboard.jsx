import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { FileText, Clock, CheckCircle, XCircle, IndianRupee } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
  <Card className={`border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow ${borderClass || ''}`}>
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

const DirectorDashboard = () => {
  const { data: { stats, recent }, loading } = useDashboard();

  if (loading) return (
    <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading dashboard...</div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Director Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Overview of pending approvals and daily expense authorizations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Pending Approval" 
          value={stats?.pending || 0} 
          icon={Clock} 
          colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40" 
        />
        <StatCard 
          title="Approved Today" 
          value={stats?.approved_today || 0} 
          icon={CheckCircle} 
          colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40" 
        />
        <StatCard 
          title="Rejected Today" 
          value={stats?.rejected_today || 0} 
          icon={XCircle} 
          colorClass="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40" 
        />
        <StatCard 
          title="Pending Total" 
          value={formatCurrency(stats?.total_pending_amount || 0)} 
          icon={IndianRupee} 
          colorClass="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40" 
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <Link to="/director/vouchers" className="text-xs font-semibold text-[var(--color-primary-lt)] dark:text-sky-400 hover:underline">
            View all vouchers →
          </Link>
        </div>
        
        {(!recent || recent.length === 0) ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm py-4">No recent activity found.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recent.map((v) => (
              <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors">
                <div>
                  <Link to={`/director/vouchers/${v.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-[var(--color-primary)] dark:hover:text-sky-400 transition-colors">
                    <span className="font-mono text-slate-500 dark:text-slate-400 mr-2">{v.voucher_number}</span>
                    {v.expense_title}
                  </Link>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">By <span className="font-medium text-slate-700 dark:text-slate-300">{v.employee_name}</span> • {formatDate(v.updated_at)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{formatCurrency(v.amount)}</span>
                  <StatusBadge status={v.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectorDashboard;
