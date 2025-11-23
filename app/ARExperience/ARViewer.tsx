"use client";

import React, { useEffect } from "react";

export default function CameraARViewer({ region, onClose }) {
  useEffect(() => {
    // تحميل model-viewer
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  // اختيار الملف حسب المنطقة
  const getModel = () => {
    switch (region) {
      case "Northern":
        return "/models/northern.glb";
      case "Eastern":
        return "/models/eastern.glb";
      case "Najdi":
        return "/models/najdi.glb";
      case "Hejazi":
        return "/models/hejazi.glb";
      case "Southern":
        return "/models/southern.glb";
      default:
        return "/models/default.glb";
    }
  };

  return (
    <div className="ar-overlay">
      <button className="close-btn" onClick={onClose}>
        ✖
      </button>

      <model-viewer
        src={getModel()}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        style={{
          width: "100vw",
          height: "100vh",
          background: "transparent",
        }}
      ></model-viewer>
    </div>
  );
}
