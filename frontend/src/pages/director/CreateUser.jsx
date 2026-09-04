import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/users';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Eye, EyeOff, Copy, CheckCircle2 } from 'lucide-react';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    employee_id: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Success state
  const [createdUser, setCreatedUser] = useState(null);
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    setError('');
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value, employee_id: value === 'employee' ? prev.employee_id : '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name || formData.name.length < 2) errors.name = 'Name must be at least 2 characters';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Valid email address is required';
    if (!formData.role) errors.role = 'Role is required';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // let backend auto-generate
      
      const res = await createUser(payload);
      if (res.success) {
        setCreatedUser(res.data.user);
        setTempPassword(res.data.temporaryPassword);
      } else {
        setError(res.error?.message || 'Failed to create user');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setFieldErrors(prev => ({ ...prev, email: 'A user with this email already exists.' }));
      } else {
        setError(err.response?.data?.error?.message || 'An error occurred while creating user');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">User Created Successfully</h3>
          </div>
          
          <div className="space-y-4 mb-8 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-slate-500 dark:text-slate-400 font-medium">Name:</div>
              <div className="col-span-2 text-slate-900 dark:text-white font-medium">{createdUser.name}</div>
              
              <div className="text-slate-500 dark:text-slate-400 font-medium">Email:</div>
              <div className="col-span-2 text-slate-900 dark:text-white font-medium">{createdUser.email}</div>
              
              <div className="text-slate-500 dark:text-slate-400 font-medium">Role:</div>
              <div className="col-span-2 text-slate-900 dark:text-white font-medium capitalize">{createdUser.role}</div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="text-slate-700 dark:text-slate-300 font-bold mb-2">Temporary Password:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-center tracking-wider text-lg text-slate-900 dark:text-white">
                  {tempPassword}
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-lt)] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-xl transition shadow-sm flex-shrink-0"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-3 font-medium bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg flex items-center gap-2">
                <span className="text-lg">⚠</span> Share this securely. It will not be shown again.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/director/users')}
            className="w-full py-6 text-lg rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create User</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Add a new employee or accounts team member.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Priya Nair"
                className={`dark:bg-slate-800 dark:border-slate-700 ${fieldErrors.name ? 'border-red-500' : ''}`}
              />
              {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="priya@company.com"
                className={`dark:bg-slate-800 dark:border-slate-700 ${fieldErrors.email ? 'border-red-500' : ''}`}
              />
              {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-slate-700 dark:text-slate-300">Role *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="accounts">Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'employee' && (
              <div className="grid gap-2">
                <Label htmlFor="employee_id" className="text-slate-700 dark:text-slate-300">Employee ID</Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="e.g. EMP-105"
                  className="dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to auto-generate"
                  className="dark:bg-slate-800 dark:border-slate-700 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Leave blank to auto-generate a secure temporary password.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/director/users')}
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-lt)] dark:bg-sky-600 dark:hover:bg-sky-500 px-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Creating...
                </div>
              ) : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
