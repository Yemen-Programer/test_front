// UserManagement.js
'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Sidebar/page';
import UserModal from './UserAddModal';
import UserTable from './userTable';
import UserService from "../../../services/user";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    role: ''
  });

  useEffect(() => {
    loadUsers();
  }, [currentPage, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await UserService.getAll(currentPage, 10, filters);
      setUsers(result.data);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        await UserService.delete(id);
        loadUsers();
        alert("تم الحذف بنجاح");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(error.message || "فشل في الحذف");
      }
    }
  };

  const handleSave = async (userData) => {
    try {
      if (editingUser) {
        await UserService.update(editingUser.id, userData);
      } else {
        await UserService.create(userData);
      }

      setIsModalOpen(false);
      loadUsers();
      alert(editingUser ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.message || "فشل في الحفظ");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <DashboardLayout activePage="users">
      <div className="content-management">

        {/* Header */}
        <div className="page-header">
          <button className="add-button" onClick={handleAdd}>
            + إضافة مستخدم جديد
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="pagination-btn"
                >
                  السابق
                </button>
                
                <span className="pagination-info">
                  الصفحة {currentPage} من {totalPages}
                </span>
                
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="pagination-btn"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          user={editingUser}
        />

      </div>
    </DashboardLayout>
  );
};

export default UserManagement;