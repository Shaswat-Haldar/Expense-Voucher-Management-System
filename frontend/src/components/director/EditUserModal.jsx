import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { updateUser } from '../../api/users';
import { toast } from 'sonner';

const EditUserModal = ({ user, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || '',
    employee_id: user?.employee_id || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ 
      ...prev, 
      role: value,
      employee_id: value === 'employee' ? prev.employee_id : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await updateUser(user.id, formData);
      if (res.success) {
        toast.success('User updated successfully');
        onSuccess(res.data);
      } else {
        setError(res.error?.message || 'Failed to update user');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
            <Input 
              id="email" 
              value={user.email} 
              disabled 
              className="bg-slate-50 dark:bg-slate-800 text-slate-500"
            />
            <p className="text-xs text-slate-500">Email cannot be changed after account creation.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name *</Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
              required 
              className="dark:bg-slate-800 dark:border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-700 dark:text-slate-300">Role *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange} required>
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
            <div className="space-y-2">
              <Label htmlFor="employee_id" className="text-slate-700 dark:text-slate-300">Employee ID</Label>
              <Input 
                id="employee_id" 
                name="employee_id"
                value={formData.employee_id} 
                onChange={handleChange}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-lt)] dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
