'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, MapPin, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import WishlistService from '../regions/north/services/wishlist';
import './wishlist.css';

interface WishlistItem {
  id: string;
  content: {
    id: string;
    title: string;
    type: string;
    region: string;
    image: string | null;
    votesCount: number;
  };
  createdAt: string;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  // جلب userId من localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
          return user.id;
        }
        return null;
      } catch (error) {
        console.error('Error getting user from storage:', error);
        return null;
      }
    };

    getUserFromStorage();
  }, []);

  // تحميل قائمة الأمنيات
  const loadWishlist = async () => {

    try {
      setLoading(true);
         const userId = localStorage.getItem('userId');
      const response = await WishlistService.getUserWishlist(userId);
      
      if (response.success) {
        setWishlistItems(response.data);
      } else {
        throw new Error(response.message || 'فشل في جلب قائمة الأمنيات');
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('فشل في تحميل قائمة الأمنيات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
      loadWishlist();
    
  }, [currentUserId]);

  // دالة إزالة من قائمة الأمنيات
  const handleRemoveFromWishlist = async (contentId: string) => {
  const userId = localStorage.getItem('userId');
    try {
      const response = await WishlistService.removeFromWishlist(userId, contentId);
      
      if (response.success) {
        // تحديث القائمة محلياً
        setWishlistItems(prev => 
          prev.filter(item => item.content.id !== contentId)
        );
        alert('تمت الإزالة من قائمة الأمنيات');
      }
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      alert(error.response?.data?.message || 'حدث خطأ أثناء الإزالة');
    }
  };

  // دالة للذهاب إلى تفاصيل المحتوى
  const handleContentClick = (contentId: string) => {
    router.push(`/content/${contentId}`);
  };

  // دالة للعودة
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل قائمة الأمنيات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <Header />
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={loadWishlist} className="retry-button">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <Header />

      {/* رأس الصفحة */}
      <header className="wishlist-header">
        <div className="header-content">

          <h1 className="wishlist-title">
      
            قائمة الأمنيات
          </h1>
          <p className="wishlist-subtitle">
            الأماكن التراثية التي حفظتها للزيارة لاحقاً
          </p>
          <div className="wishlist-stats">
            <span className="items-count">
              {wishlistItems.length} عنصر
            </span>
          </div>
        </div>
      </header>

      {/* محتوى قائمة الأمنيات */}
      <main className="wishlist-content">
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <Bookmark size={64} className="empty-icon" />
            <h2>قائمة الأمنيات فارغة</h2>
            <p>لم تقم بإضافة أي أماكن تراثية إلى قائمة الأمنيات بعد</p>
            <button 
              className="browse-button"
              onClick={() => router.push('/regions/north')}
            >
              استكشاف الأماكن التراثية
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div 
                  className="wishlist-image"
                  onClick={() => handleContentClick(item.content.id)}
                >
                  {item.content.image ? (
                    <img 
                      src={`${API_BASE_URL}/uploads/${item.content.image}`}
                      alt={item.content.title}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <MapPin size={32} />
                    </div>
                  )}
                  <div className="wishlist-overlay">
                    <span className="content-type">{item.content.type}</span>

                  </div>
                </div>
                
                <div className="wishlist-info">
                  <h3 onClick={() => handleContentClick(item.content.id)}>
                    {item.content.title}
                  </h3>
                  
                  <div className="wishlist-meta">

                    <span className="added-date">
                      {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>

                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveFromWishlist(item.content.id)}
                    title="إزالة من قائمة الأمنيات"
                  >
                    <Trash2 size={16} />
                    إزالة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;