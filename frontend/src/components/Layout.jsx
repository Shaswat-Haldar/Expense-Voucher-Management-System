import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-[1180px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
