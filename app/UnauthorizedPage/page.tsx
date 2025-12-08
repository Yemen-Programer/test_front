'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Home, LogIn } from 'lucide-react';
import './page.css';

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        {/* رمز الحماية */}
        <div className="icon-container">
          <Shield size={80} className="shield-icon" />
          <div className="forbidden-symbol">⛔</div>
        </div>

        {/* الرسالة الرئيسية */}
        <h1 className="title">وصول غير مصرح</h1>
        
        {/* الرسالة التوضيحية */}
        <div className="message-section">
          <p className="main-message">
            عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.
          </p>
        </div>



        {/* أزرار التحكم */}
        <div className="actions-container">

          <button 
            onClick={() => router.push('/login')}
            className="action-btn secondary-btn"
          >
            <LogIn size={18} />
            <span>تسجيل الدخول</span>
          </button>
        </div>



        {/* رقم الخطأ (اختياري للتتبع) */}
        <div className="error-code">
          <span>رمز الخطأ: <code>403_FORBIDDEN</code></span>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;