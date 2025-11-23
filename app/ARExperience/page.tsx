'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import './page.css';

interface ARExperienceProps {
  region: string;
  onClose: () => void;
}

// تحميل المكون ديناميكياً بدون SSR
const ARViewer = dynamic(() => import('./ARViewer'), {
  ssr: false,
  loading: () => (
    <div className="loading">
      <div className="spinner"></div>
      <p>جاري تحميل تجربة الواقع المعزز...</p>
    </div>
  )
});

const ARExperience: React.FC<ARExperienceProps> = ({ region, onClose }) => {
  return (
    <Suspense fallback={
      <div className="loading">
        <div className="spinner"></div>
        <p>جاري تحميل تجربة الواقع المعزز...</p>
      </div>
    }>
      <ARViewer region={region} onClose={onClose} />
    </Suspense>
  );
};

export default ARExperience;