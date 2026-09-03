import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, CheckSquare } from 'lucide-react';
import { cn } from '../utils/index';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const getLinks = () => {
    switch (user?.role) {
      case 'employee':
        return [
          { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
          { name: 'My Vouchers', path: '/employee/vouchers', icon: FileText },
        ];
      case 'director':
        return [
          { name: 'Dashboard', path: '/director/dashboard', icon: LayoutDashboard },
          { name: 'Pending Approvals', path: '/director/approvals', icon: CheckSquare },
          { name: 'All Vouchers', path: '/director/vouchers', icon: FileText },
        ];
      case 'accounts':
        return [
          { name: 'Dashboard', path: '/accounts/dashboard', icon: LayoutDashboard },
          { name: 'All Vouchers', path: '/accounts/vouchers', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col no-print transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] dark:bg-sky-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">ABC Company</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Expense Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-[var(--color-primary)] text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              )
            }
          >
            <link.icon className="w-4 h-4 shrink-0" />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-400 dark:text-slate-500">
        Prachay Securities Pvt. Ltd.
      </div>
    </aside>
  );
};

export default Sidebar;
