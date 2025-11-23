'use client';

import React, { useState } from 'react';
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
import './page.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: string;
}
const DashboardLayout = ({ children, activePage }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: <LayoutDashboard size={20} /> },
    { id: 'content', name: 'إدارة المحتوى', icon: <Package size={20} /> },
    { id: 'users', name: 'إدارة المستخدمين', icon: <Users size={20} /> },
    { id: 'media', name: 'المكتبة الإعلامية', icon: <Image size={20} /> },
    { id: 'settings', name: 'الإعدادات', icon: <Settings size={20} /> },
  ];

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
              href={`/admin/${item.id}`}
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
