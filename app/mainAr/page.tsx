"use client";

import { useState } from "react";
import  "./page.css";

type Region = "Northern" | "Eastern" | "Najdi" | "Hejazi" | "Southern";

const MODELS: Record<Region, { glb: string; usdz: string }> = {
  Northern: { glb: "/images/1.glb", usdz: "/images/1.usdz" },
  Eastern: { glb: "/images/2.glb", usdz: "/images/2.usdz" },
  Najdi: { glb: "/images/3.glb", usdz: "/images/3.usdz" },
  Hejazi: { glb: "/images/4.glb", usdz: "/images/4.usdz" },
  Southern: { glb: "/images/5.glb", usdz: "/images/5.usdz" },
};

export default function Page() {
  const [arRegion, setArRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);

  const openAR = async (region: Region) => {
    try {
      setLoading(true);
      await navigator.mediaDevices.getUserMedia({ video: true });
      setArRegion(region);
    } catch (err) {
      alert("يجب السماح باستخدام الكاميرا");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeAR = () => {
    setArRegion(null);
  };

  return (
    <div className={styles.container}>
      {/* الكروت */}
      <div className={styles.starLayout}>
        <div
          className={`${styles.card} ${styles.north}`}
          onClick={() => openAR("Northern")}
        >
          <h2>الزي الشمالي</h2>
          <p className={styles.hint}>اضغط للتجربة</p>
        </div>
        <div
          className={`${styles.card} ${styles.east}`}
          onClick={() => openAR("Eastern")}
        >
          <h2>الزي الشرقي</h2>
          <p className={styles.hint}>اضغط للتجربة</p>
        </div>
        <div
          className={`${styles.card} ${styles.center}`}
          onClick={() => openAR("Najdi")}
        >
          <h2>المنطقة الوسطى </h2> 
          <p className={styles.hint}>اضغط للتجربة</p>
        </div>
        <div
          className={`${styles.card} ${styles.west}`}
          onClick={() => openAR("Hejazi")}
        >
          <h2>الزي الحجازي</h2>
          <p className={styles.hint}>اضغط للتجربة</p>
        </div>
        <div
          className={`${styles.card} ${styles.south}`}
          onClick={() => openAR("Southern")}
        >
          <h2>الزي الجنوبي</h2>
          <p className={styles.hint}>اضغط للتجربة</p>
        </div>
      </div>

      {/* شاشة AR */}
      {arRegion && (
        <div className={styles.arScreen}>
          <model-viewer
            src={MODELS[arRegion].glb}
            ios-src={MODELS[arRegion].usdz}
            camera-controls
            ar
            auto-rotate
            ar-modes="webxr scene-viewer quick-look"
            style={{ width: "100%", height: "100%" }}
          >
            <button slot="ar-button" className={styles.arButton}>
              تشغيل الواقع المعزز
            </button>
          </model-viewer>
          <button className={styles.backButton} onClick={closeAR}>
            العودة
          </button>
        </div>
      )}

      {loading && <div className={styles.loading}>جاري التحميل...</div>}
    </div>
  );
}
