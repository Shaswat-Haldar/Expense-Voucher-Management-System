import React, { useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterPanel = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    voucher_number: '',
    employee_name: '',
    department: '',
    status: '',
    date_from: '',
    date_to: '',
    amount_min: '',
    amount_max: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onFilter(cleanFilters);
  };

  const handleClear = () => {
    setFilters({
      voucher_number: '', employee_name: '', department: '', status: '',
      date_from: '', date_to: '', amount_min: '', amount_max: ''
    });
    onFilter({});
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print mb-4 transition-colors">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Voucher Number</label>
            <input 
              type="text" 
              name="voucher_number" 
              placeholder="e.g. EXP-202609..." 
              value={filters.voucher_number} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Employee Name</label>
            <input 
              type="text" 
              name="employee_name" 
              placeholder="Filter by employee..." 
              value={filters.employee_name} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Department</label>
            <select 
              name="department" 
              value={filters.department} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Status</label>
            <select 
              name="status" 
              value={filters.status} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Expense Date:</span>
            <div className="flex gap-2 items-center w-full">
              <input type="date" name="date_from" value={filters.date_from} onChange={handleChange} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full" />
              <span className="text-slate-400">to</span>
              <input type="date" name="date_to" value={filters.date_to} onChange={handleChange} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full" />
            </div>
          </div>
          
          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="flex gap-2 items-center w-full">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Amount (₹):</span>
              <input type="number" name="amount_min" placeholder="Min" value={filters.amount_min} onChange={handleChange} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full" />
              <span className="text-slate-400">-</span>
              <input type="number" name="amount_max" placeholder="Max" value={filters.amount_max} onChange={handleChange} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs w-full" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button 
            type="button" 
            onClick={handleClear} 
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button 
            type="submit" 
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[var(--color-primary)] dark:bg-sky-500 text-white dark:text-slate-950 rounded-xl hover:bg-[var(--color-primary-lt)] dark:hover:bg-sky-400 shadow-sm transition"
          >
            <Filter className="w-3.5 h-3.5" />
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;
