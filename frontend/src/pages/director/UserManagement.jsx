import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, toggleUserActive } from '../../api/users';
import { AuthContext } from '../../context/AuthContext';
import { Search, Plus, UserX, UserCheck, Eye, Edit } from 'lucide-react';
import EditUserModal from '../../components/director/EditUserModal';

const UserManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  
  // Modal state
  const [editUser, setEditUser] = useState(null);
  
  // Deactivate confirm
  const [confirmToggle, setConfirmToggle] = useState(null);
  const [toggling, setToggling] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter !== '') params.is_active = statusFilter === 'active';

      const res = await getUsers(params);
      if (res.success && res.data) {
        setUsers(res.data.users);
        setPagination({
          page: res.data.page,
          limit: res.data.limit,
          total: res.data.total
        });
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleActive = async () => {
    if (!confirmToggle) return;
    
    setToggling(true);
    try {
      const newStatus = !confirmToggle.is_active;
      const res = await toggleUserActive(confirmToggle.id, newStatus);
      if (res.success) {
        setUsers(users.map(u => u.id === confirmToggle.id ? res.data : u));
      }
    } catch (error) {
      console.error("Toggle failed", error);
    } finally {
      setToggling(false);
      setConfirmToggle(null);
    }
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
  
  const getRoleColor = (role) => {
    switch(role) {
      case 'employee': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
      case 'accounts': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
      case 'director': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };
  
  const getAvatarColor = (role) => {
    switch(role) {
      case 'employee': return 'bg-blue-500';
      case 'accounts': return 'bg-amber-500';
      case 'director': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">User Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage employee accounts</p>
        </div>
        <Link 
          to="/director/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-lt)] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-xl font-medium text-sm transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lt)] dark:focus:ring-sky-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lt)] dark:focus:ring-sky-500"
          >
            <option value="">All Roles</option>
            <option value="employee">Employee</option>
            <option value="accounts">Accounts</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-lt)] dark:focus:ring-sky-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Emp ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No users found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shadow-sm ${getAvatarColor(user.role)}`}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {user.employee_id || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-[#2A9D8F] text-white shadow-sm tracking-wide">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-[#E63946] text-white shadow-sm tracking-wide">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {formatLastLogin(user.last_login_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/director/users/${user.id}`}
                          className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-sky-400 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setEditUser(user)}
                          className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] dark:hover:text-sky-400 transition"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => setConfirmToggle(user)}
                          disabled={currentUser?.id === user.id}
                          className={`p-1.5 transition ${currentUser?.id === user.id ? 'opacity-30 cursor-not-allowed text-slate-400' : (user.is_active ? 'text-slate-400 hover:text-red-500' : 'text-slate-400 hover:text-emerald-500')}`}
                          title={currentUser?.id === user.id ? "Cannot deactivate your own account" : (user.is_active ? "Deactivate" : "Activate")}
                        >
                          {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium text-slate-900 dark:text-white">{users.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to <span className="font-medium text-slate-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-slate-900 dark:text-white">{pagination.total}</span> users
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
            >
              Previous
            </button>
            <button 
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditUserModal 
        user={editUser} 
        isOpen={!!editUser} 
        onClose={() => setEditUser(null)} 
        onSuccess={(updated) => {
          setUsers(users.map(u => u.id === updated.id ? updated : u));
          setEditUser(null);
        }}
      />

      {/* Confirm Deactivate Modal */}
      {confirmToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {confirmToggle.is_active ? 'Deactivate User?' : 'Activate User?'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {confirmToggle.is_active 
                ? `Deactivate ${confirmToggle.name}? They will immediately lose access to the system.` 
                : `Activate ${confirmToggle.name}? They will regain access to the system.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmToggle(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleToggleActive}
                disabled={toggling}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition ${confirmToggle.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                {toggling ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
