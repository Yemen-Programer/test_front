// pages/login.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { apiService } from 'app/signup/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        // حفظ بيانات المستخدم في localStorage
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userEmail', response.data.user.email);

        // توجيه المستخدم بناءً على الـ role
        switch (response.data.user.role) {
          case 'admin':
            window.location.href = '/dashboard/users';
            break;
          case 'user':
          default:
            window.location.href = '/home';
            break;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className='flex flex-col lg:flex-row gap-6 lg:gap-10 items-center w-full max-w-4xl'>
       
        <div className="text-center w-full lg:w-1/3 order-1 lg:order-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">ياهلا و يا مسهلا</h1>
          <p className="text-gray-600 text-base sm:text-lg">ابدأ جولتك معانا</p>
        </div>

    
        <div className="shadow-xl p-6 sm:p-8 w-full lg:w-2/3 bg-white rounded-xl sm:rounded-2xl order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

         
            <div className="flex flex-col-reverse sm:flex-row-reverse items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4">
              {/* رابط إنشاء حساب جديد */}
              <Link 
                href="/signup" 
                className="text-sm text-[#3c1053] hover:text-purple-800 hover:underline transition text-center w-full sm:w-auto"
              >
                ليس لديك حساب؟ سجل الآن
              </Link>
              
              {/* زر تسجيل الدخول */}
              <button 
                type="submit"
                className="py-2 px-6 bg-[#3c1053] text-white font-medium rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition text-sm w-full sm:w-auto"
              >
                سجل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}