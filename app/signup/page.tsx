// pages/index.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // معالجة إنشاء الحساب هنا
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className='flex flex-col lg:flex-row gap-6 lg:gap-10 items-start w-full max-w-4xl'>
        {/* قسم النص الترحيبي - يأخذ 1/3 من المساحة */}
        <div className="text-center w-full lg:w-1/4 order-1 lg:order-1">
          <p className="text-gray-600 text-base sm:text-lg p-4">ما عندك حساب بموقعنا</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 p-4">حياك اللَّه</h1>
          <p className="text-gray-600 text-base sm:text-lg p-4">انشى حسابك الآن</p>
        </div>

        {/* قسم الفورم - يأخذ 2/3 من المساحة */}
        <div className="shadow-xl p-6 sm:p-8 w-full lg:w-3/4 bg-white rounded-xl sm:rounded-2xl order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* حقل اسم المستخدم */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="username" className="block text-sm w-full font-medium text-gray-700 text-right sm:w-24">
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-right"
                required
              />
            </div>

            {/* حقل الإيميل */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-right sm:w-24">
                الايميل
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-right"
                required
              />
            </div>

            {/* حقل كلمة المرور */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-right sm:w-24">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-right"
                required
              />
            </div>

            {/* حقل تأكيد كلمة المرور */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-right sm:w-24">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-right"
                required
              />
            </div>

            {/* قسم زر التسجيل والرابط */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4">
              {/* رابط تسجيل الدخول */}
              <Link 
                href="/login" 
                className="text-sm text-[#3c1053] hover:text-purple-800 hover:underline transition text-center w-full sm:w-auto"
              >
                لديك حساب؟ سجل الدخول
              </Link>
              
              {/* زر تسجيل الحساب */}
              <button 
                type="submit"
                className="py-2 px-6 bg-[#3c1053] text-white font-medium rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition text-sm w-full sm:w-auto"
              >
                تسجيل الحساب
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}