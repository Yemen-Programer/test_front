'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Menu, 
  X,
  Users,
  Image,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import './page.css';

const DashboardLayout = ({ children, activePage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard/content', name: 'إدارة المحتوى', icon: <Package size={20} /> },
    { id: 'dashboard/users', name: 'إدارة المستخدمين', icon: <Users size={20} /> },
  ];

  useEffect(() => {
    // التحقق من تسجيل الدخول والدور
    const checkAuth = async () => {
      try {
        // جلب بيانات المستخدم من localStorage أو API
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        
        if (!userId) {
          router.push('/login');
          return;
        }
        
        // التحقق من أن المستخدم لديه دور admin
        if (userRole !== 'admin') {
          router.push('/UnauthorizedPage');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>نظام التراث</h2>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <a
              key={item.id}
              href={`/${item.id}`}
              className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="page-title">
              {menuItems.find(item => item.id === activePage)?.name || 'لوحة التحكم'}
            </h1>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <span>مرحباً، المدير</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;