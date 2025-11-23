import React, { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const perPage = 10;

  const getRoleLabel = (role) => {
    const roleMap = {
      'user': 'مستخدم',
      'Technician': 'فني',
      'admin': 'مدير'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const classMap = {
      'user': 'role-badge-user',
      'Technician': 'role-badge-technician',
      'admin': 'role-badge-admin'
    };
    return classMap[role] || 'role-badge-user';
  };

  const sortedData = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const getSortIcon = (key) =>
    sortConfig.key !== key ? (
      <ArrowUpDown size={16} />
    ) : sortConfig.direction === "asc" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / perPage);
  const currentData = sortedData.slice((currentPage - 1) * perPage, currentPage * perPage);
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, sortedData.length);
  const totalItems = sortedData.length;

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="table-container">
      {/* Pagination Info */}
      <div className="pagination-info">
        <span>
          عرض {startItem}-{endItem} من أصل {totalItems} مستخدم
        </span>
      </div>

      <div className="table-wrapper">
        <table className="data-table">

          {/* HEADER */}
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}># {getSortIcon("id")}</th>
              <th onClick={() => handleSort("name")}>الاسم {getSortIcon("name")}</th>
              <th onClick={() => handleSort("email")}>البريد الإلكتروني {getSortIcon("email")}</th>
              <th onClick={() => handleSort("role")}>الدور {getSortIcon("role")}</th>
              <th>تاريخ الإنشاء</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentData.map((user, index) => (
              <tr key={user.id}>

                <td>{(currentPage - 1) * perPage + index + 1}</td>

                <td className="title-cell">{user.name}</td>

                <td>{user.email}</td>

                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>

                <td>
                  {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                </td>

                <td>
                  <div className="actions-container">
                    <button className="action-btn edit-btn" onClick={() => onEdit(user)}>
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => onDelete(user.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {currentData.length === 0 && (
          <div className="empty-state">
            <p>لا توجد مستخدمين لعرضها</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <div className="pagination-buttons">
            {/* First Page */}
            <button
              className="pagination-btn"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsRight size={16} />
            </button>

            {/* Previous Page */}
            <button
              className="pagination-btn"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronRight size={16} />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map(page => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Next Page */}
            <button
              className="pagination-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Last Page */}
            <button
              className="pagination-btn"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsLeft size={16} />
            </button>
          </div>

          {/* Page Selector */}
          <div className="page-selector">
            <span>انتقل إلى:</span>
            <select
              value={currentPage}
              onChange={(e) => goToPage(Number(e.target.value))}
              className="page-select"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <option key={page} value={page}>
                  الصفحة {page}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;