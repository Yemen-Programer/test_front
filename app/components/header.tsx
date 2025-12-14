"use client";
import { apiService } from 'app/posts/services/api';
import { useState, useEffect } from 'react';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const menuStructure = [
    {
      mainTitle: "نبذة تعريفية",
      mainColor: "#774230",
      subItems: [
        { title: "الصفحة الرئيسية", color: "#2A0F38", href: "/home" },
        { title: "من نحن", color: "#2A0F38", href: "/about" },
      ]
    },
    {
      mainTitle: "تجارب رئيسية",
      mainColor: "#774230", 
      href:"/experince",
      subItems: [
        { title: "جولات افتراضية", color: "#2A0F38", href: "/virtualReality" },
        { title: "تجربة الواقع المعزز", color: "#2A0F38", href: "/mainAr" },
        { title: "اسأل دليلة", color: "#2A0F38", href: "/chat" }
      ]
    },
    {
      mainTitle: "المناطق",
      mainColor: "#774230",
      subItems: [
        { title: "المنطقة الشمالية", color: "#2A0F38", href: "/regions/north" },
        { title: "المنطقة الوسطى", color: "#2A0F38", href: "/regions/central" },
        { title: "المنطقة الغربية", color: "#2A0F38", href: "/regions/western" },
        { title: "المنطقة الجنوبية", color: "#2A0F38", href: "/regions/southern" },
        { title: "المنطقة الشرقية", color: "#2A0F38", href: "/regions/eastern" }
      ]
    },
    {
      mainTitle: "المقالات",
      mainColor: "#774230", 
      href:"/posts",
      subItems: [
        { title: "صفحة المقالات", color: "#2A0F38", href: "/posts" },
      ]
    },
  ];

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    const checkAuthStatus = () => {
      const userId = localStorage.getItem('userId');
      setIsLoggedIn(!!userId);
    };

    checkAuthStatus();
    
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // تحميل الإشعارات إذا كان المستخدم مسجل الدخول
  useEffect(() => {
    if (isLoggedIn) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
      if (showSearchResults && !event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showSearchResults]);

  const loadNotifications = async () => {
    try {
      const response = await apiService.getNotifications();
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const response = await apiService.searchContent(searchQuery);
      if (response.success) {
        setSearchResults(response.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // البحث أثناء الكتابة (Debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch({ preventDefault: () => {} });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId.toString());
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'share':
        return '🔄';
      case 'new_post':
        return '📝';
      default:
        return '🔔';
    }
  };

  const getRegionArabicName = (region) => {
    const regions = {
      'northern': 'المنطقة الشمالية',
      'eastern': 'المنطقة الشرقية',
      'central': 'المنطقة الوسطى',
      'western': 'المنطقة الغربية',
      'southern': 'المنطقة الجنوبية'
    };
    return regions[region] || region;
  };
const getRegionSlug = (region) => {
  const regionMapping = {
    'northern': 'north',
    'eastern': 'eastern',
    'central': 'central',
    'western': 'western', 
    'southern': 'southern'
  };
  return regionMapping[region] || region;
};
  const highlightText = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <header className="w-full border-b border-gray-300 p-4 relative bg-[#FFF1E2] backdrop-blur-sm z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-lg bg-white border border-[#774230]/20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Right Navigation Menu - Desktop */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-start">
          {menuStructure.map((item, index) => (
            <div 
              key={index}
              className="relative"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 group relative hover:bg-white/50"
                style={{ color: item.mainColor }}
              >
                <a className="font-semibold text-base hover:text-[#2A0F38] transition-colors" href={item.href}>
                  {item.mainTitle}
                </a>
                <span className="text-xs transition-transform group-hover:rotate-180">▼</span>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-0 w-64 bg-white rounded-2xl shadow-2xl border border-[#774230]/20 z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 group-hover:mt-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.href}
                      className="block px-6 py-4 text-sm transition-all duration-200 hover:bg-[#FFF1E2] hover:pr-8 border-b border-[#774230]/10 last:border-b-0 hover:translate-x-2 group/subitem"
                      style={{ color: subItem.color }}
                    >
                      <span className="group-hover/subitem:text-[#774230] font-bold transition-colors duration-200">
                        {subItem.title}
                      </span>
                    </a>
                  ))}
                </div>
              </button>
            </div>
          ))}
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-[#774230]/20 lg:hidden z-40 shadow-lg">
            <nav className="p-4">
              {menuStructure.map((item, index) => (
                <div key={index} className="mb-2">
                  <button 
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-[#FFF1E2] text-left"
                    style={{ color: item.mainColor }}
                    onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                  >
                    <span className="font-semibold">{item.mainTitle}</span>
                    <span className={`text-xs transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  
                  {activeDropdown === index && (
                    <div className="mt-2 ml-4 bg-white rounded-lg border border-[#774230]/10">
                      {item.subItems.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm border-b border-[#774230]/10 last:border-b-0 hover:bg-[#FFF1E2]"
                          style={{ color: subItem.color }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Center Logo */}
        <div className="absolute left-1/2 top-18 mb-10 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <img 
              src="/images/logo.jpg" 
              alt="إرث السعودية - التراث والثقافة" 
              className="object-contain w-[180px] h-16 md:w-[200px] md:h-20 lg:w-[220px] lg:h-24 transition-all duration-300"
            />
          </div>
        </div>

        {/* Left Section: Search & Auth */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          {/* Search Input مع النتائج */}
          <div className="search-container flex-1 max-w-xs md:max-w-md relative">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  placeholder="ابحث في التراث السعودي..."
                  className="w-full px-4 py-2 pr-12 bg-white border-2 border-[#774230] rounded-xl outline-none text-gray-700 text-sm md:text-base placeholder-gray-400 transition-all duration-300 focus:border-[#2A0F38] focus:shadow-lg focus:shadow-[#774230]/20"
                />
                <button 
                  type="submit"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#774230] to-[#2A0F38] text-white p-1.5 md:p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg focus:ring-2 focus:ring-[#774230]/30"
                >
                  {searchLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* نتائج البحث - Model */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-[#774230]/20 z-50 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-[#774230]/10 bg-gradient-to-r from-[#FFF1E2] to-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg" style={{ color: '#774230' }}>
                      🔍 نتائج البحث
                    </h3>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="text-gray-500 hover:text-[#774230] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-[#2A0F38] mt-1">
                    {searchLoading ? 'جاري البحث...' : `${searchResults.length} نتيجة لـ "${searchQuery}"`}
                  </p>
                </div>

                {/* Results List */}
                <div className="max-h-80 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#774230] mx-auto"></div>
                      <p className="text-gray-500 mt-2">جاري البحث في المحتوى...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-[#FFF1E2] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="text-gray-500 font-medium">لا توجد نتائج</p>
                      <p className="text-sm text-gray-400 mt-1">جرب استخدام كلمات بحث أخرى</p>
                    </div>
                  ) : (
                    searchResults.map((result) => (
                      <a
                        key={result.id}
                         href={`/regions/${getRegionSlug(result.region)}`}
                        className="block p-4 border-b border-[#774230]/10 hover:bg-[#FFF1E2] cursor-pointer transition-all duration-200 group"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 
                              className="font-bold text-[#2A0F38] text-sm leading-tight group-hover:text-[#774230] mb-1"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightText(result.title, searchQuery) 
                              }}
                            />
                            <p 
                              className="text-xs text-gray-600 leading-relaxed line-clamp-2"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightText(result.highlightedText || result.description, searchQuery) 
                              }}
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-[#774230] text-white px-2 py-1 rounded-full">
                                {result.regionArabic || getRegionArabicName(result.region)}
                              </span>
                              <span className="text-xs text-gray-500 capitalize">
                                {result.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))
                  )}
                </div>

                {/* Footer */}
                {searchResults.length > 0 && (
                  <div className="p-3 border-t border-[#774230]/10 bg-gray-50/50">
                    <p className="text-xs text-center text-gray-500">
                      {searchResults.length} نتيجة • ابحث عن "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* إشعارات */}
          {isLoggedIn && (
            <div className="relative notifications-container">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 md:p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative group border-2 border-[#774230]/20 hover:border-[#774230]/40"
                style={{ color: '#774230' }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-gradient-to-r from-[#774230] to-[#2A0F38] text-white rounded-full w-4 h-4 md:w-6 md:h-6 text-xs flex items-center justify-center animate-pulse shadow-lg font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* قائمة الإشعارات  */}
              {showNotifications && (
                <div className="absolute top-12 left-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border-2 border-[#774230]/20 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-[#774230]/10 bg-gradient-to-r from-[#FFF1E2] to-white">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg" style={{ color: '#774230' }}>
                        📬 الإشعارات
                      </h3>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm px-3 py-1 bg-[#774230] text-white rounded-lg hover:bg-[#2A0F38] transition-colors font-medium"
                          >
                            تعيين الكل كمقروء
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-500 hover:text-[#774230] transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <p className="text-sm text-[#2A0F38] mt-1">
                        لديك {unreadCount} إشعار غير مقروء
                      </p>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-[#FFF1E2] rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🔔</span>
                        </div>
                        <p className="text-gray-500 font-medium">لا توجد إشعارات جديدة</p>
                        <p className="text-sm text-gray-400 mt-1">سيظهر هنا أي نشاط جديد</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-[#774230]/10 hover:bg-[#FFF1E2] cursor-pointer transition-all duration-200 group ${
                            !notification.read ? 'bg-blue-50/50 border-r-4 border-r-[#774230]' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0 shadow-lg"
                              style={{ 
                                background: 'linear-gradient(135deg, #774230, #2A0F38)'
                              }}
                            >
                              <span className="text-base">{getNotificationIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 leading-relaxed group-hover:text-[#2A0F38]">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-[#774230] font-medium bg-[#FFF1E2] px-2 py-1 rounded-full">
                                  {notification.type === 'like' && 'إعجاب'}
                                  {notification.type === 'comment' && 'تعليق'}
                                  {notification.type === 'share' && 'مشاركة'}
                                  {notification.type === 'new_post' && 'منشور جديد'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-[#774230] rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-[#774230]/10 bg-gray-50/50">
                      <p className="text-xs text-center text-gray-500">
                        {notifications.length} إشعار • {unreadCount} غير مقروء
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* زر تسجيل الدخول/تسجيل الخروج */}
          {!isLoggedIn ? (
            <div className="flex gap-2">

              <a 
                href="/login"
                className="py-2 px-6 bg-[#3c1053] text-white font-medium rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition text-sm w-full sm:w-auto"
              >
                تسجيل الدخول
              </a>
            </div>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white border-2 border-[#774230]/20 rounded-lg hover:border-[#774230] hover:bg-[#FFF1E2] transition-all duration-300 shadow-lg">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-[#774230] to-[#2A0F38] rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
                  {localStorage.getItem('userName')?.[0] || 'م'}
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 max-w-16 md:max-w-24 truncate hidden sm:block">
                  {localStorage.getItem('userName') || 'المستخدم'}
                </span>
                <span className="text-xs text-[#774230] transition-transform group-hover:rotate-180 hidden md:block">▼</span>
              </button>
              
             
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-[#774230]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                <div className="p-4 border-b border-[#774230]/10 bg-gradient-to-r from-[#FFF1E2] to-white">
                  <p className="text-sm font-bold text-[#774230]">{localStorage.getItem('userName')}</p>
                  <p className="text-xs text-[#2A0F38] truncate">{localStorage.getItem('userEmail')}</p>
                  <p className="text-xs text-gray-500 mt-1 bg-white px-2 py-1 rounded-full inline-block">
                    {localStorage.getItem('userRole') === 'admin' ? 'مدير' : 
                     localStorage.getItem('userRole') === 'Technician' ? 'فني' : 'مستخدم'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-end gap-2"
                >
                  <span>تسجيل الخروج</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default Header;