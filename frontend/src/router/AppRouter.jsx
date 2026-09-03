import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import Layout from '../components/Layout';
import LoginPage from '../pages/auth/LoginPage';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import CreateVoucher from '../pages/employee/CreateVoucher';
import EditVoucher from '../pages/employee/EditVoucher';
import MyVouchers from '../pages/employee/MyVouchers';
import EmployeeVoucherDetail from '../pages/employee/VoucherDetail';
import DirectorDashboard from '../pages/director/DirectorDashboard';
import PendingApprovals from '../pages/director/PendingApprovals';
import DirectorAllVouchers from '../pages/director/AllVouchers';
import DirectorVoucherDetail from '../pages/director/VoucherDetail';
import AccountsDashboard from '../pages/accounts/AccountsDashboard';
import AccountsAllVouchers from '../pages/accounts/AllVouchers';
import AccountsVoucherDetail from '../pages/accounts/VoucherDetail';

const AppRouter = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                
                {/* Employee Routes */}
                <Route path="/employee/*" element={
                  <RoleRoute allowedRoles={['employee']}>
                    <Routes>
                      <Route path="dashboard" element={<EmployeeDashboard />} />
                      <Route path="vouchers" element={<MyVouchers />} />
                      <Route path="vouchers/new" element={<CreateVoucher />} />
                      <Route path="vouchers/:id" element={<EmployeeVoucherDetail />} />
                      <Route path="vouchers/:id/edit" element={<EditVoucher />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </RoleRoute>
                } />

                {/* Director Routes */}
                <Route path="/director/*" element={
                  <RoleRoute allowedRoles={['director']}>
                    <Routes>
                      <Route path="dashboard" element={<DirectorDashboard />} />
                      <Route path="approvals" element={<PendingApprovals />} />
                      <Route path="vouchers" element={<DirectorAllVouchers />} />
                      <Route path="vouchers/:id" element={<DirectorVoucherDetail />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </RoleRoute>
                } />

                {/* Accounts Routes */}
                <Route path="/accounts/*" element={
                  <RoleRoute allowedRoles={['accounts']}>
                    <Routes>
                      <Route path="dashboard" element={<AccountsDashboard />} />
                      <Route path="vouchers" element={<AccountsAllVouchers />} />
                      <Route path="vouchers/:id" element={<AccountsVoucherDetail />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </RoleRoute>
                } />

                <Route path="/" element={<Navigate to="/login" replace />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AppRouter;
