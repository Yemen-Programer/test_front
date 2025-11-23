"use client";
import { useState } from 'react';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // معالجة البحث هنا
    console.log('بحث عن:', searchQuery);
  };

  return (
    <header className="w-full border-b border-gray-300 p-4 relative bg-[#FFF1E2] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Right Navigation Menu */}
        <nav className="flex items-center gap-8 flex-1 justify-start">
          {menuStructure.map((item, index) => (
            <div 
              key={index}
              className="relative"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button 
                className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 group relative"
                style={{ color: item.mainColor }}
              >
                <a className="font-semibold text-base" href={item.href}>
                  {item.mainTitle}
                </a>
                <span className="text-xs transition-transform">▼</span>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-0 w-64 bg-white rounded-2xl shadow-xl border border-amber-100 z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 group-hover:mt-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.href}
                      className="block px-6 py-4 text-sm transition-all duration-200 hover:bg-amber-50 hover:pr-8 border-b border-amber-50 last:border-b-0 hover:translate-x-2 group/subitem"
                      style={{ color: subItem.color }}
                    >
                      <span className="group-hover/subitem:text-[#2A0F38] font-bold transition-colors duration-200">
                        {subItem.title}
                      </span>
                    </a>
                  ))}
                </div>
              </button>
            </div>
          ))}
        </nav>

        {/* Center Logo */}
        <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src="/images/logo.jpeg" 
            alt="إرث السعودية - التراث والثقافة" 
            className="object-contain w-[220px]"
          />
        </div>

        {/* Left Section: Search */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Search Input - تصميم محسن */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في التراث السعودي..."
                className="w-full px-3 py-2 bg-white border-2 border-[#774230] rounded-lg outline-none text-gray-700 text-base placeholder-gray-400 transition-all duration-300 focus:border-[#2A0F38] focus:shadow-sm"
              />
              <button 
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#774230] to-[#2A0F38] text-white p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg focus:ring-2 focus:ring-[#774230]/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* تأثير إضافي */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#774230]/5 to-[#2A0F38]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;