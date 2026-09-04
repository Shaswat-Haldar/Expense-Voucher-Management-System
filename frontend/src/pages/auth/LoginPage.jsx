import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Moon, Sun, Lock, Mail, ArrowRight } from 'lucide-react';
import { AnimatedGridBackground } from '../../components/InfiniteGrid';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data.email, data.password);
      if (response.success) {
        navigate(`/${response.data.role}/dashboard`);
        toast.success('Logged in successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <AnimatedGridBackground className="bg-[var(--bg-page)] transition-colors">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        {/* Theme Toggle in top right */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] dark:bg-sky-500 text-white dark:text-slate-950 font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-md">
            ABC
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ABC Company</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expense Voucher Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                placeholder="name@company.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-lt)] dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        
        {/* Quick Demo Credentials Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 text-center">
            Click to autofill demo credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('employee@demo.com', 'Employee@123')}
              className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition text-center"
            >
              Employee
            </button>
            <button
              type="button"
              onClick={() => fillDemo('director@demo.com', 'Director@123')}
              className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition text-center"
            >
              Director
            </button>
            <button
              type="button"
              onClick={() => fillDemo('accounts@demo.com', 'Accounts@123')}
              className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition text-center"
            >
              Accounts
            </button>
          </div>
        </div>
        </div>
      </div>
    </AnimatedGridBackground>
  );
};

export default LoginPage;
