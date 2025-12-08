"use client";
import { useState } from 'react';
import Header from '../components/header';
import { useRouter } from 'next/navigation';

const ExperiencesPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const router = useRouter();

  const experiences = [
    {
      id: 1,
      title: "تجربة الواقع الافتراضي والجولات 360 درجة",
      description: "نقدم تجارب واقع افتراضي غامرة وجولات 360 درجة تتيح للعملاء استكشاف الأماكن والمنتجات بشكل تفاعلي. نوفر حلولاً متكاملة للعقارات والتعليم والسياحة والتجارة الإلكترونية.",
      color: "rgb(215, 185, 228)",
      url: "images/vr.jpg",
      link: "/virtualReality"
    },
    {
      id: 2,
      title: "تجربة الواقع المعزز",
      description: "نطور تطبيقات واقع معزز مبتكرة تدمج العناصر الرقمية مع العالم الحقيقي. نقدم حلولاً للتعليم والتسوق والترفيه والمعارض، مما يعزز تجربة المستخدم ويسهل عملية اتخاذ القرارات.",
      color: "rgb(215, 185, 228)",
      url: "images/ar.jpg",
      link: "/mainAr"
    },
    {
      id: 3,
      title: "أسأل دليلة",
      description: "نقدم مساعد ذكي تفاعلي \"دليلة\" يجيب على استفسارات العملاء ويقدم التوصيات الشخصية. يستخدم الذكاء الاصطناعي لفهم الاحتياجات وتقديم حلول مخصصة في الوقت الفعلي مع تجربة محادثة طبيعية.",
      color: "rgb(215, 185, 228)",
      url: "",
      link: "/chat"
    }
  ];

  const handleCardClick = (link) => {
    router.push(link);
  };

  return (
    <div>
      <Header></Header>
  
      <div className="experiences-page bg-white">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">تجارب</h1>
            <p className="page-description">
              نقدم مجموعة متنوعة من التجارب التكنولوجية المبتكرة التي تدمج بين الإبداع والتقنية المتطورة. 
              نعمل على تصميم حلول تفاعلية غامرة تلبي متطلبات العصر الرقمي وتحدث فرقاً حقيقياً.
            </p>
          </header>

          <div className="cards-container">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="card"
                onClick={() => handleCardClick(experience.link)}
                onMouseEnter={() => setHoveredCard(experience.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  className="card-content" 
                  style={{ 
                    backgroundImage: experience.url ? `url(${experience.url})` : 'none',
                    backgroundColor: !experience.url ? '#D7B9E4' : 'transparent'
                  }}
                >
                  <div className="card-overlay">
                    <h2>{experience.title}</h2>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .experiences-page {
          background-color: rgb(255, 255, 255);
          color: rgb(0, 0, 0);
          min-height: 100vh;
          margin: 0;
          padding: 2rem;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          gap: 3rem;
        }

        .page-header {
          text-align: center;
          max-width: 600px;
        }

        .page-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin: 0 0 1.5rem 0;
          background: #2A0F38;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-description {
          font-size: 1.2rem;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.8);
          margin: 0;
        }

        .cards-container {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
          min-height: 70vh;
          position: relative;
        }

        .card {
          width: 320px;
          height: 220px;
          background: #D7B9E4;
          position: relative;
          display: flex;
          flex-direction: column;
          place-content: center;
          place-items: center;
          overflow: hidden;
          border-radius: 20px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: translateY(-10px);
        }

        .card-content {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card-overlay {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          text-align: center;
          gap: 15px;
          background: rgba(215, 185, 228, 0.7); /* خلفية شفافة بلون الكرت */
        }

        .card h2 {
          z-index: 3;
          color: #000000; /* اللون الأسود */
          font-size: 1.4em;
          text-align: center;
          margin: 0;
          font-weight: bold;
          padding: 0 10px;
        }

        .card-button {
          background: #2A0F38;
          color: white;
          padding: 8px 24px;
          border-radius: 25px;
          font-size: 0.9em;
          transition: all 0.3s ease;
          border: 2px solid white;
          cursor: pointer;
          z-index: 3;
          text-decoration: none;
        }

        .card-button.hovered {
          background: white;
          color: #2A0F38;
          transform: scale(1.05);
        }

        .card-button:hover {
          background: white;
          color: #2A0F38;
        }

        /* تأثيرات الخلفية الدوارة */
        .card::before {
          content: '';
          position: absolute;
          width: 180px;
          background-image: linear-gradient(180deg, #2A0F38, #774230);
          height: 200%;
          animation: rotBGimg 3s linear infinite;
          transition: all 0.2s linear;
          z-index: 1;
        }

        @keyframes rotBGimg {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .card::after {
          content: '';
          position: absolute;
          background: #D7B9E4;
          inset: 5px;
          border-radius: 15px;
          z-index: 2;
        }

        /* تأثيرات الحدود المتحركة الإضافية */
        .card {
          position: relative;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 22px;
          background: conic-gradient(
              from var(--angle),
              #2A0F38 40%,
              transparent,
              #2A0F38 60%
            );
          mask: conic-gradient(yellow 0 0) subtract,
            conic-gradient(yellow 0 0) padding-box;
          opacity: 0.75;
          z-index: 0;
          animation-name: neon-rotate;
          animation-duration: 8s;
          animation-direction: forwards;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        @keyframes neon-rotate {
          from {
            --angle: 0deg;
          }
          to {
            --angle: 360deg;
          }
        }

        /* تأثيرات خاصة لكل كرت */
        .card:nth-child(1)::before {
          background-image: linear-gradient(180deg, #2A0F38, #774230);
        }

        .card:nth-child(2)::before {
          background-image: linear-gradient(180deg, #2A0F38, #774230);
        }

        .card:nth-child(3)::before {
          background-image: linear-gradient(180deg, #2A0F38, #774230);
        }

        /* تنسيق للشاشات المتوسطة */
        @media (max-width: 1024px) {
          .cards-container {
            gap: 30px;
          }
          
          .card {
            width: 300px;
            height: 200px;
          }
          
          .card h2 {
            font-size: 1.3em;
          }
        }

        /* تنسيق للشاشات الصغيرة */
        @media (max-width: 768px) {
          .experiences-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .cards-container {
            flex-direction: column;
            gap: 30px;
          }
          
          .card {
            width: 280px;
            height: 180px;
          }
          
          .card::before {
            width: 160px;
            height: 180%;
          }
          
          .card h2 {
            font-size: 1.2em;
          }
          
          .card-button {
            padding: 6px 20px;
            font-size: 0.85em;
          }
          
          .card:nth-child(3)::before {
            width: 170px;
            height: 190%;
          }
        }

        /* تنسيق للشاشات الصغيرة جداً */
        @media (max-width: 480px) {
          .card {
            width: 260px;
            height: 170px;
          }
          
          .card::before {
            width: 150px;
            height: 170%;
          }
          
          .card h2 {
            font-size: 1.1em;
          }
          
          .card-button {
            font-size: 0.8em;
            padding: 5px 18px;
          }
          
          .card:nth-child(3)::before {
            width: 160px;
            height: 180%;
          }
        }
      `}</style>
    </div>
  );
};

export default ExperiencesPage;