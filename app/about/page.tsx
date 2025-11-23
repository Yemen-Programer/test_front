"use client";
import { useState } from 'react';
import { FaUsers, FaEye, FaStar, FaArrowRight } from 'react-icons/fa';
import Header from '../components/header';

const OurIdentityPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);


  const cards = [
    {
      id: 1,
      title: "من نحن",
      content: "مند نجح - نحن فريق متخصص في تقديم الحلول المبتكرة والخدمات عالية الجودة التي تلبي احتياجات عملائنا في مختلف المجالات.",
      icon: <FaUsers className="text-3xl" />,
      buttonText: "تعرف علينا"
    },
    {
      id: 2,
      title: "رؤيتنا",
      content: "رئیسنا - نسعى لأن نكون الرواد في مجالنا من خلال الابتكار والتميز والجودة في كل ما نقدمه، مع التركيز على تحقيق أقصى قيمة لعملائنا.",
      icon: <FaEye className="text-3xl" />,
      buttonText: "اكتشف الرؤية"
    },
    {
      id: 3,
      title: "أهدافنا",
      content: "آیدا - نهدف إلى تحقيق النمو المستدام وبناء شراكات استراتيجية طويلة الأمد، مع الالتزام بالتميز والابتكار في جميع جوانب عملنا.",
      icon: <FaStar className="text-3xl" />,
      buttonText: "تعرف على الأهداف"
    }
  ];

  return (
    <div>
     <Header></Header>
    <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center p-4 font-[Tajawal]">
       
      <div className="container max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-16 text-[#2A0F38]">
          هويتنا
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="card bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 ease-in-out transform hover:-translate-y-2 border-2 border-transparent cursor-pointer"
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === card.id 
                  ? '#D7B9E4' 
                  : '#ffffff'
              }}
            >
              {/* الأيقونة */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                hoveredCard === card.id 
                  ? 'bg-white text-[#2A0F38]' 
                  : 'bg-[#D7B9E4] text-[#2A0F38]'
              }`}>
                {card.icon}
              </div>
              
              {/* العنوان */}
              <h2 className={`text-3xl font-bold mb-4 transition-all duration-500 ${
                hoveredCard === card.id ? 'text-[#2A0F38]' : 'text-[#2A0F38]'
              }`}>
                {card.title}
              </h2>
              

              
              {/* المحتوى */}
              <p className={`mb-8 text-lg leading-relaxed transition-all duration-500 ${
                hoveredCard === card.id ? 'text-[#2A0F38]' : 'text-[#2A0F38]'
              }`}>
                {card.content}
              </p>
              
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default OurIdentityPage;
