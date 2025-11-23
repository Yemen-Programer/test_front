"use client";
import Header from '../components/header';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* استخدام ال Header المنفصل */}
      <Header />
      
      {/* محتوى الصفحة الرئيسية */}
      <div className='flex md:flex-row flex-col p-4 pt-20 gap-8'>
        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#774230] leading-tight">
            إكتشاف الموروث و الثقافة السعودية " إرث "
          </h1>
          <p className="max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed">
            التراث السعودي بحر ماله ساحل شرقه لؤلؤ وغربه تاريخ وشماله شِعر وجنوبه فنون .. كلها تجمعنا تحت سقف واحد
          </p>
        </div>
        
        <img 
          src="images/main2.jpeg" 
          alt="التراث السعودي"
          className='lg:w-[600px] lg:h-[400px] md:w-[500px] md:h-[300px] rounded-2xl shadow-lg'
        />
      </div>
    </div>
  );
}