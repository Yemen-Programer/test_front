import React, { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2, Eye, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";

const BASE_URL = "http://localhost:5000"; // ← عدل حسب السيرفر
interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: string;
  region: string;
  image?: string | null;
}

interface ContentTableProps {
  contents: ContentItem[];
  onEdit: (content: ContentItem) => void;
  onDelete: (id: number) => void;
}

const ContentTable = ({ contents, onEdit, onDelete }: ContentTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedImage, setSelectedImage] = useState(null);

  const perPage = 10;
const getTypeLabel = (type: string) => {
    const map = {
      'heritage': 'المعالم التراثية',
      'intangible-oral': 'التراث الشفوي',
      'intangible-crafts': 'الحرف اليدوية',
      'intangible-folklore': 'الفلكلور',
      'clothing-men': 'الزي الرجالي',
      'clothing-women': 'الزي النسائي',
      'clothing-boys': 'زي البنين',
      'clothing-girls': 'زي البنات',
      'food': 'الأكلات الشعبية'
    };
    return map[type] || type;
  };

const getRegionLabel = (region: string) => {
    const map = {
      'northern': 'المنطقة الشمالية',
      'eastern': 'المنطقة الشرقية',
      'central': 'المنطقة الوسطى',
      'western': 'المنطقة الغربية',
      'southern': 'المنطقة الجنوبية'
    };
    return map[region] || region;
  };

  const sortedData = [...contents].sort((a, b) => {
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
          عرض {startItem}-{endItem} من أصل {totalItems} عنصر
        </span>
      </div>

      <div className="table-wrapper">
        <table className="data-table">

          {/* HEADER */}
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}># {getSortIcon("id")}</th>
              <th onClick={() => handleSort("title")}>العنوان {getSortIcon("title")}</th>
              <th onClick={() => handleSort("type")}>النوع {getSortIcon("type")}</th>
              <th onClick={() => handleSort("region")}>المنطقة {getSortIcon("region")}</th>
              <th>الوصف</th>
              <th>الصورة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {currentData.map((content, index) => (
              <tr key={content.id}>

                <td>{(currentPage - 1) * perPage + index + 1}</td>

                <td>{content.title}</td>

                <td>
                  <span className={`type-badge`}>
                    {getTypeLabel(content.type)}
                  </span>
                </td>

                <td>
                  <span className={`region-badge`}>
                    {getRegionLabel(content.region)}
                  </span>
                </td>

                <td>
                  {content.description.length > 80
                    ? content.description.substring(0, 80) + "..."
                    : content.description}
                </td>

                <td>
                  {content.image ? (
                    <img
                      src={`${BASE_URL}/uploads/${content.image}`}
                      className="content-image"
                      onClick={() => setSelectedImage(`${BASE_URL}/uploads/${content.image}`)}
                    />
                  ) : (
                    <span>لا توجد صورة</span>
                  )}
                </td>

                <td>
                  <button className="action-btn edit-btn" onClick={() => onEdit(content)}>
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => onDelete(content.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
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

      {/* IMAGE PREVIEW POPUP */}
      {selectedImage && (
        <div className="preview-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="preview-image" />
        </div>
      )}
    </div>
  );
};

export default ContentTable;
