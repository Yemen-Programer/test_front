"use client";

import React, { useState } from "react";
import ARWebXR from "./ar";
import "./page.css";

const MODELS: any = {
  Northern: "/images/clo/1.glb",
  Eastern: "/models/east.glb",
  Najdi: "/models/najdi.glb",
  Hejazi: "/models/hejazi.glb",
  Southern: "/models/south.glb",
};

const ARExperienceCards = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const cards = [
    { id: 1, title: "الزي الشمالي", region: "Northern", position: "top-left" },
    { id: 2, title: "الزي الشرقي", region: "Eastern", position: "top-right" },
    { id: 3, title: "الزي النجدي", region: "Najdi", position: "center" },
    { id: 4, title: "الزي الحجازي", region: "Hejazi", position: "bottom-left" },
    { id: 5, title: "الزي الجنوبي", region: "Southern", position: "bottom-right" },
  ];

  const handleCardClick = async (region: string) => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setSelectedRegion(region);
    } catch {
      alert("يجب السماح باستخدام الكاميرا");
    }
  };

  return (
    <>
      <div className="star-layout">
        {cards.map((c) => (
          <div
            key={c.id}
            className={`card ${c.position}`}
            onClick={() => handleCardClick(c.region)}
          >
            <h2>{c.title}</h2>
            <p className="card-subtitle">تجربة الواقع المعزز</p>
            <div className="card-hint">اضغط للتجربة</div>
          </div>
        ))}
      </div>

      {selectedRegion && (
        <ARWebXR
          modelUrl={MODELS[selectedRegion]}
          onClose={() => setSelectedRegion(null)}
        />
      )}
    </>
  );
};

export default ARExperienceCards;
