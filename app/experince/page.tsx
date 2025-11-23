"use client";
import { useState } from 'react';
import Header from '../components/header';

const ExperiencesPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const experiences = [
    {
      id: 1,
      title: "تجربة الواقع الافتراضي والجولات 360 درجة",
      description: "نقدم تجارب واقع افتراضي غامرة وجولات 360 درجة تتيح للعملاء استكشاف الأماكن والمنتجات بشكل تفاعلي. نوفر حلولاً متكاملة للعقارات والتعليم والسياحة والتجارة الإلكترونية.",
      color: "rgb(215, 185, 228)",
      backgroundImage: "images/vr.jpg"
    },
    {
      id: 2,
      title: "تجربة الواقع المعزز",
      description: "نطور تطبيقات واقع معزز مبتكرة تدمج العناصر الرقمية مع العالم الحقيقي. نقدم حلولاً للتعليم والتسوق والترفيه والمعارض، مما يعزز تجربة المستخدم ويسهل عملية اتخاذ القرارات.",
      color: "rgb(215, 185, 228)",
      backgroundImage: "images/ar.jpg"
    },
    {
      id: 3,
      title: "أسأل دليلة",
      description: "نقدم مساعد ذكي تفاعلي \"دليلة\" يجيب على استفسارات العملاء ويقدم التوصيات الشخصية. يستخدم الذكاء الاصطناعي لفهم الاحتياجات وتقديم حلول مخصصة في الوقت الفعلي مع تجربة محادثة طبيعية.",
      color: "rgb(215, 185, 228)",
      backgroundImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

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

        <div className="cards">
          {experiences.map((experience) => (
            <article 
              key={experience.id}
              className="card"
              style={{
                '--moon-clr': experience.color,
                '--animation-duration': '8s'
              }}
              onMouseEnter={() => setHoveredCard(experience.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className=' w-full flex flex-col justify-between' style={{ backgroundImage: `url(${experience.backgroundImage})` }}>
                <h2>{experience.title}</h2>
                {/* <p>{experience.description}</p> */}
                <a href="#" className={hoveredCard === experience.id ? 'hovered' : ''}>
                 المزيد
                </a>
              </div>
            </article>
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
          margin-top : 20px;
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

        .cards {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem;
        }

        .card {
          --border-width: 5px;
          --glow-offset: -20px;
          --border-radius: 0px;

          position: relative;
          border: solid var(--border-width) #0000;
          border-radius: var(--border-radius);
          min-height: 400px;
          isolation: isolate;
          background-attachment: fixed;
          background-size: cover;
          background-position: center;
          transition: transform 0.3s ease;

          &:hover {
            transform: translateY(-5px);
          }

          & > div {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100%;
            padding: 1.5rem;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;

            &::before {
              content: "";
              position: absolute;
              inset: 0;
              background: linear-gradient(to bottom, var(--moon-clr), #0000);
              opacity: 0.5;
              z-index: -1;
            }
          }

          & h2 {
            margin: 0 0 1rem 0;
            font-size: 1.4rem;
            text-shadow: 1px 1px var(--moon-clr);
            font-weight: bold;
            line-height: 1.3;
          }

          & p {
            text-shadow: 0 0 2px black;
            font-size: 1rem;
            line-height: 1.5;
            margin: 15px 0 1.5rem 0;
          }

          & a {
            background-color: var(--moon-clr);
            color: black;
            font-size: 0.9rem;
            text-transform: lowercase;
            width: 120px;
            height : 40px;
            padding: 0.5rem 1rem;
            margin-top : 230px;
            text-decoration: none;
            transition: all 150ms ease-in-out;
            border: 1px solid rgba(255 255 255 / 0.5);
            text-align: center;
            border-radius: 2px;
            justify-self: start;
          }

          &::before {
            content: "";
            position: absolute;
            inset: calc(var(--border-width) * -1);
            border: inherit;
            border-radius: inherit;
            background: conic-gradient(
                from var(--angle),
                #2A0F38 40%,
                transparent,
               #2A0F38 60%
              )
              border-box;
            mask: conic-gradient(yellow 0 0) subtract,
              conic-gradient(yellow 0 0) padding-box;
            opacity: 0.75;
            z-index: 1;
            animation-name: neon-rotate;
            animation-duration: var(--animation-duration);
            animation-direction: forwards;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }

          &::after {
            content: "";
            inset: var(--glow-offset);
            position: absolute;
            z-index: -2;
            background-color: #2A0F38;
            background: conic-gradient(
              from var(--angle),
              #2A0F38,
              transparent,
             #2A0F38
            );
            border-radius: 15px;
            filter: blur(12px);
            opacity: 0.75;
            animation-name: neon-rotate;
            animation-duration: var(--animation-duration);
            animation-direction: forwards;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }
        }

        @keyframes neon-rotate {
          from {
            --angle: 0deg;
          }
          to {
            --angle: 360deg;
          }
        }

        /* التجاوب مع الشاشات الصغيرة */
        @media (max-width: 768px) {
          .experiences-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .cards {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .card {
            min-height: 350px;
          }

          .card h2 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExperiencesPage;