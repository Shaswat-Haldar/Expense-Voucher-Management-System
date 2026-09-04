import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserById, toggleUserActive } from '../../api/users';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, UserX, UserCheck, Edit, Clock, CalendarDays, Shield, Building2 } from 'lucide-react';
import EditUserModal from '../../components/director/EditUserModal';
import { formatDate } from '../../utils/formatters';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserById(id);
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleToggleActive = async () => {
    setToggling(true);
    try {
      const newStatus = !user.is_active;
      const res = await toggleUserActive(user.id, newStatus);
      if (res.success) {
        setUser(res.data);
      }
    } catch (error) {
      console.error("Toggle failed", error);
    } finally {
      setToggling(false);
      setConfirmToggle(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading user profile...</div>;
  }

  if (error || !user) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">User not found</h3>
        <Link to="/director/users" className="text-[var(--color-primary)] dark:text-sky-400 hover:underline">
          ← Back to Users
        </Link>
      </div>
    );
  }

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
    if (!dateString) return 'Never logged in';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          to="/director/users" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-sm transition shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Edit User
          </button>
          
          <button 
            onClick={() => setConfirmToggle(true)}
            disabled={currentUser?.id === user.id}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition shadow-sm border ${
              currentUser?.id === user.id 
                ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' 
                : user.is_active 
                  ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 border-red-200 dark:border-red-900' 
                  : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 border-emerald-200 dark:border-emerald-900'
            }`}
            title={currentUser?.id === user.id ? "Cannot deactivate your own account" : ""}
          >
            {user.is_active ? (
              <><UserX className="w-4 h-4" /> Deactivate</>
            ) : (
              <><UserCheck className="w-4 h-4" /> Activate</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-100 dark:border-slate-800/80">
          <div className={`w-32 h-32 rounded-full text-white flex items-center justify-center font-bold text-5xl shadow-lg ring-4 ring-white dark:ring-slate-900 ${getAvatarColor(user.role)} shrink-0`}>
            {getInitials(user.name)}
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1 justify-center md:justify-start">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-lg text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
              {user.is_active ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Account
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Inactive Account
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800/80">
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <Shield className="w-4 h-4" />
              Role Access
            </div>
            <div className="font-semibold text-slate-900 dark:text-white capitalize">{user.role}</div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <Building2 className="w-4 h-4" />
              Employee ID
            </div>
            <div className="font-semibold text-slate-900 dark:text-white font-mono">{user.employee_id || 'Not assigned'}</div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <Clock className="w-4 h-4" />
              Last Login
            </div>
            <div className="font-semibold text-slate-900 dark:text-white">{formatLastLogin(user.last_login_at)}</div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <CalendarDays className="w-4 h-4" />
              Member Since
            </div>
            <div className="font-semibold text-slate-900 dark:text-white">{formatDate(user.created_at)}</div>
          </div>
        </div>
      </div>

      <EditUserModal 
        user={user} 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        onSuccess={(updated) => {
          setUser(updated);
          setEditModalOpen(false);
        }}
      />

      {confirmToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {user.is_active ? 'Deactivate User?' : 'Activate User?'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {user.is_active 
                ? `Deactivate ${user.name}? They will immediately lose access to the system.` 
                : `Activate ${user.name}? They will regain access to the system.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmToggle(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleToggleActive}
                disabled={toggling}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition ${user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
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

export default UserDetail;
