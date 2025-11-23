'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Sidebar/page';
import ContentModal from './ContentModal';
import ContentTable from './ContentTable';
import ContentService from "../../../services/content"; // استدعاء ال API

const ContentManagement = () => {
  const [contents, setContents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContents();
  }, []);

  // تحميل كل المحتويات
  const loadContents = async () => {
    try {
      setLoading(true);
      const data = await ContentService.getAll();
      console.log(data.data)
      setContents(data.data);
    } catch (error) {
      console.error("Error loading contents:", error);
      alert("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  // فتح مودال الإضافة
  const handleAdd = () => {
    setEditingContent(null);
    setIsModalOpen(true);
  };

  // فتح مودال التعديل
  const handleEdit = (content) => {
    setEditingContent(content);
    setIsModalOpen(true);
  };

  // الحذف
  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      try {
        await ContentService.delete(id);
        loadContents();
        alert("تم الحذف بنجاح");
      } catch (error) {
        console.error("Error deleting content:", error);
        alert("فشل في الحذف");
      }
    }
  };

  // الحفظ (إضافة/تعديل)
  const handleSave = async (formData) => {
    try {
      if (editingContent) {
        await ContentService.update(editingContent.id, formData);
      } else {
        await ContentService.create(formData);
      }

      setIsModalOpen(false);
      loadContents();
      alert(editingContent ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("فشل في الحفظ");
    }
  };

  return (
    <DashboardLayout activePage="content">
      <div className="content-management">

        {/* Header */}
        <div className="page-header">

          <button className="add-button" onClick={handleAdd}>
            + إضافة محتوى جديد
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        ) : (
          <ContentTable
            contents={contents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Modal */}
        <ContentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          content={editingContent}
        />

      </div>
    </DashboardLayout>
  );
};

export default ContentManagement;
