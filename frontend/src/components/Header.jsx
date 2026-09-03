import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 transition-colors no-print">
      <div className="flex items-center gap-4 md:hidden">
        <span className="font-bold text-lg text-[var(--color-primary)] dark:text-sky-400">ABC Company</span>
      </div>
      <div className="hidden md:block">
        <span className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
          Expense Voucher Management
        </span>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <div className="text-right hidden sm:block">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</div>
        </div>
        
        <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[var(--color-primary)] dark:text-sky-400 font-semibold shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
