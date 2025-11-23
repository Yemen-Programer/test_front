"use client";
import { useState } from 'react';
import Header from '../components/header';

const VirtualRealityPage = () => {
  const [activeCard, setActiveCard] = useState(null);

  const vrExperiences = [
    {
      id: 1,
      title: "قصر المصمك",
      description: "تجربة غامرة تتيح لك استكشاف قصر المصمك التاريخي في الرياض كما كان في عصور مضت. شاهد التفاصيل المعمارية الفريدة وتعرف على الأحداث التاريخية التي شهدها هذا الصرح العظيم.",
      image: "images/1.jpeg",
      color: "#D7B9E4"
    },
    {
      id: 2,
      title: "قلعة زعبل",
      description: "انطلق في رحلة افتراضية إلى قلعة زعبل الأثرية في منطقة الجوف. استكشف القلعة التي تعود للقرن السابع عشر وتعرّف على دورها التاريخي في حماية المنطقة.",
      image: "images/2.png",
      color: "#D7B9E4"
    }
  ];

  const handleReadMore = (experienceId) => {
    // معالجة زر اقرأ المزيد
    console.log('قراءة المزيد عن:', experienceId);
  };

  return (
    <div>
         <Header></Header>
    
    <div className="virtual-reality-page">
       
      <div className="container">
        {/* العنوان الرئيسي */}
        <header className="page-header">
          <h1 className="page-title">تجربة الواقع الافتراضي</h1>
          <p className="page-description">
            استكشف التراث السعودي من خلال تجارب الواقع الافتراضي الغامرة. تتيح لك هذه التقنية 
            زيارة المواقع الأثرية والتاريخية كما كانت في عصورها الذهبية، مع تفاصيل دقيقة 
            وتجربة بصرية وصوتية فريدة تنقلك عبر الزمن.
          </p>
        </header>

        {/* شبكة البطاقات */}
        <div className="cards-grid">
          {vrExperiences.map((experience) => (
            <article 
              key={experience.id}
              className="card"
              onMouseEnter={() => setActiveCard(experience.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <img
                className="card__background"
                src={experience.image}
                alt={`صورة لـ ${experience.title}`}
                width="1920"
                height="2193"
              />
              <div className="card__content flow">
                <div className="card__content--container flow">
                  <h2 className="card__title">{experience.title}</h2>
                  <p className="card__description">
                    {experience.description}
                  </p>
                </div>

              </div>
            </article>
          ))}
        </div>
      </div>
</div>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@700&display=swap");

        :root {
          --brand-color: #D7B9E4;
          --black: hsl(0, 0%, 0%);
          --white: hsl(0, 0%, 100%);
          --font-title: "Montserrat", sans-serif;
          --font-text: "Lato", sans-serif;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body,
        h2,
        p {
          margin: 0;
        }

        .virtual-reality-page {
          background: linear-gradient(135deg, #f8f4ff 0%, #f0e8ff 100%);
          color: #333;
          min-height: 100vh;
          padding: 2rem;
          font-family: var(--font-text);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .container {
          width: 100%;
          max-width: 1400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }

        .page-header {
          text-align: center;
          max-width: 800px;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-family: var(--font-title);
          color: #2A0F38;
          margin-bottom: 1.5rem;
          margin-top: 30px;
          font-weight: bold;
        }

        .page-description {
          font-size: 1rem;
          line-height: 1.7;
          color: #555;
          margin: 0;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          width: 100%;
        }

        /* CARD COMPONENT */
        .card {
          display: grid;
          place-items: center;
          width: 100%;
          max-width: 21.875rem;
          height: 28.125rem;
          overflow: hidden;
          border-radius: 0.625rem;
          box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.25);
          margin: 0 auto;
          cursor:pointer;
        }

        .card > * {
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .card__background {
          object-fit: cover;
          max-width: 100%;
          height: 100%;
          transition: transform 500ms ease-in;
        }

        .card__content {
          --flow-space: 0.9375rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color:white;
          align-self: flex-end;
          height: 55%;
          padding: 12% 1.25rem 1.875rem;
          background: linear-gradient(
            180deg,
            hsla(0, 0%, 0%, 0) 0%,
            hsla(0, 0%, 0%, 0.3) 10%,
            hsl(0, 0%, 0%) 100%
          );
          transform: translateY(62%);
          transition: transform 500ms ease-out;
          transition-delay: 500ms;
        }

        .card__content--container {
          --flow-space: 1.25rem;
        }

        .card__title {
          position: relative;
          width: fit-content;
          width: -moz-fit-content;
          font-size: 1.5rem;
        }

        .card__title::after {
          content: "";
          position: absolute;
          height: 0.3125rem;
          width: calc(100% + 1.25rem);
          bottom: calc((1.25rem - 0.5rem) * -1);
          left: -1.25rem;
          background-color: var(--brand-color);
          opacity: 0;
          transform: scaleX(0);
          transition: opacity 1000ms ease-in, transform 500ms ease-out;
          transition-delay: 500ms;
          transform-origin: right;
        }

        .card__description {
          font-family: var(--font-text);
          font-size: 1rem;
          line-height: 1.5;
          color: var(--white);
        }

    

        .flow > * + * {
          margin-top: var(--flow-space, 1em);
        }

        .card__content--container > :not(.card__title),
        .card__button {
          opacity: 0;
          transition: transform 500ms ease-out, opacity 500ms ease-out;
        }

        /* Hover Effects */
        .card:hover {
          transform: scale(1.05);
          transition: transform 500ms ease-in;
        }

        .card:hover .card__content {
          transform: translateY(0);
          transition: transform 500ms ease-in;
        }

        .card:hover .card__background {
          transform: scale(1.3);
        }

        .card:hover .card__content--container > :not(.card__title),
        .card:hover .card__button {
          opacity: 1;
          transition: opacity 500ms ease-in;
          transition-delay: 1000ms;
        }

        .card:hover .card__title::after {
          opacity: 1;
          transform: scaleX(1);
          transform-origin: left;
          transition: opacity 500ms ease-in, transform 500ms ease-in;
          transition-delay: 500ms;
        }

        /* التجاوب مع الشاشات الصغيرة */
        @media (max-width: 768px) {
          .virtual-reality-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .page-description {
            font-size: 1.1rem;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .card {
            height: 25rem;
            max-width: 100%;
          }

          .card__title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 2rem;
          }

          .card {
            height: 22rem;
          }

          .card__content {
            padding: 10% 1rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VirtualRealityPage;