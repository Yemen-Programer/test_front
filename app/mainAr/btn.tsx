"use client";

import React, { useState } from "react";

const CameraPermissionButton = ({ onGranted }: { onGranted: () => void }) => {
  const [error, setError] = useState("");

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // إذا اشتغلت الكاميرا
      stream.getTracks().forEach(track => track.stop()); 
      onGranted();
    } catch (err) {
      setError("⚠ يجب السماح باستخدام الكاميرا للمتابعة");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "30vh" }}>
      <button
        onClick={requestCameraPermission}
        style={{
          background: "#4A148C",
          padding: "15px 25px",
          borderRadius: "10px",
          color: "white",
          fontSize: "20px",
        }}
      >
        📸 اضغط للسماح باستخدام الكاميرا
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
      )}
    </div>
  );
};

export default CameraPermissionButton;
