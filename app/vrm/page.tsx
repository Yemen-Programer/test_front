// components/MasmakStreetViewIframe.js
'use client';
import { useState } from 'react';

const MasmakStreetViewIframe = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // إحداثيات قصر المصمك
  const masmakLat = 24.6275;
  const masmakLng = 46.7134;
  
  // رابط iframe لـ Google Street View
  const streetViewUrl = `https://www.google.com/maps/embed/v1/streetview?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&location=${masmakLat},${masmakLng}&heading=0&pitch=0&fov=90`;

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* iframe Street View */}
      <iframe
        src={streetViewUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
      />
      
      {/* شاشة التحميل */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">جاري تحميل الجولة الافتراضية...</p>
            <p className="text-sm text-gray-300 mt-2">قصر المصمك - الرياض</p>
          </div>
        </div>
      )}

      {/* معلومات التحكم */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-black bg-opacity-80 text-white p-4 rounded-lg">
        <div className="text-center">
          <h3 className="font-bold text-yellow-300 mb-2">🎮 تحكم كامل بالماوس</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span>🖱️ اسحب للتجول في جميع الاتجاهات</span>
            <span>🔍 عجلة الماوس للتقريب</span>
            <span>🔄 انقر على الأسهم للانتقال</span>
          </div>
        </div>
      </div>

      {/* عنوان الموقع */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">جولة 360° - قصر المصمك 🏰</h1>
        <p className="text-gray-600">استخدم الماوس للتجول في الجولة الافتراضية</p>
      </div>
    </div>
  );
};

export default MasmakStreetViewIframe;