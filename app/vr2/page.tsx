"use client";
import { useState } from "react";
import ThreeJS360Viewer from "./vrMain";

const VirtualTourPage = () => {
  const [currentScene, setCurrentScene] = useState("scene2");
  const [autoRotate, setAutoRotate] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, text: "" });

  const scenes = {
    scene11: {
      name: "القصر - غرفة 9 ",
      panorama: "/images/vr/masmak_11_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene10",
          yaw: 55,
          pitch: 0,
          type: "arrow",
          target: "scene10",
          title: "الغرفة 8 ",
        }
      ],
    },
    scene10: {
      name: "القصر - غرفة 8 ",
      panorama: "/images/vr/masmak_10_2_360.png",
      description: ".",
      hotspots: [
        {
          id: "toScene9",
          yaw: 60,
          pitch: 0,
          type: "arrow",
          target: "scene9",
          title: " غرفة 7 ",
        },
        {
          id: "toScene11",
          yaw: 85,
          pitch: 0,
          type: "arrow",
          target: "scene11",
          title: "غرفة 9 ",
        },

      ],
    },
      scene9: {
      name: "القصر - غرفة 7 ",
      panorama: "/images/vr/masmak_9_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene10",
          yaw: 100,
          pitch: 0,
          type: "arrow",
          target: "scene10",
          title: "الغرفة 8 ",
        },
        {
          id: "toScene8",
          yaw: -85,
          pitch: 0,
          type: "arrow",
          target: "scene8",
          title: "الغرفة 6",
        }, 
      ],
    },
    scene8: {
      name: "القصر - غرفة 6 ",
      panorama: "/images/vr/masmak_8_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene9",
          yaw: 110,
          pitch: 0,
          type: "arrow",
          target: "scene9",
          title: "الغرفة 7 ",
        },
            {
          id: "toScene7",
          yaw: -60,
          pitch: 0,
          type: "arrow",
          target: "scene7",
          title:"الغرفة 5 ",
        },
      ],
    },
    scene7: {
      name: "القصر - غرفة 5 ",
      panorama: "/images/vr/masmak_7_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene8",
          yaw: 120,
          pitch: 0,
          type: "arrow",
          target: "scene8",
          title: "الغرفة 6 ",
        },
        {
          id: "toScene6",
          yaw: -80,
          pitch: 0,
          type: "arrow",
          target: "scene6",
          title: "الغرفة 4 ",
        },

      ],
    },
    scene6: {
      name: "القصر - غرفة 4",
      panorama: "/images/vr/masmak_6_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene5",
          yaw: -145,
          pitch: 0,
          type: "arrow",
          target: "scene5",
          title: "الغرفة 3 ",
        },
        {
          id: "toScene7",
          yaw: 130,
          pitch: 0,
          type: "arrow",
          target: "scene7",
          title: "الغرفة 5 ",
        }
      ],
    },
    scene5: {
      name: "القصر - غرفة 3",
      panorama: "/images/vr/masmak_5_2_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene4",
          yaw: -60,
          pitch: 10,
          type: "arrow",
          target: "scene4",
          title: "الغرفة 1  ",
        },
         {
          id: "toScene6",
          yaw: 60,
          pitch: 0,
          type: "arrow",
          target: "scene6",
          title: "الغرفة 4 ",
        },

      ],
    },
      scene4: {
      name: "غرفة 1 ",
      panorama: "/images/vr/masmak_4_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene5",
          yaw: 140,
          pitch: 0,
          type: "arrow",
          target: "scene5",
          title: "غرفة 2 ",
        },
        {
          id: "toScene3",
          yaw: 0,
          pitch: 5,
          type: "arrow",
          target: "scene3",
          title: "مدخل القصر",
        },


      ],
    },
     scene3: {
      name: "مدخل القصر",
      panorama: "/images/vr/masmak_3_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene4",
          yaw: -0,
          pitch: 10,
          type: "arrow",
          target: "scene4",
          title: "غرفة 1 ",
        },
        {
          id: "toScene2",
                    yaw: 200,
          pitch: 2,
          type: "arrow",
          target: "scene2",
          title: " الرجوع الى البوابة",
        },


      ],
    },
      scene2: {
      name: "بوابة القصر",
      panorama: "/images/vr/masmak_2_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene3",
          yaw: 170,
          pitch: 0,
          type: "arrow",
          target: "scene3",
          title: "المدخل",
        },

      ],
    },
  };

  const handleHotspotClick = (hotspot) => {
   
    if (!hotspot || typeof hotspot !== "object") {
      console.warn("handleHotspotClick: invalid hotspot:", hotspot);
      return;
    }

    if (hotspot.type === "arrow" && hotspot.target) {
   
      if (scenes[hotspot.target]) {
        setCurrentScene(hotspot.target);
      } else {
        console.warn("Target scene does not exist:", hotspot.target);
      }
    } else if (hotspot.type === "info" && hotspot.info) {

      setInfoModal({ open: true, text: hotspot.info });
    } else {
      console.warn("Unhandled hotspot type or missing data:", hotspot);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
      <div className="relative w-full h-screen">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`absolute top-6 right-6 z-20 p-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
            autoRotate ? "bg-green-500/90 text-white" : "bg-white/80 text-gray-700"
          }`}
        >
          {autoRotate ? "⏸️ إيقاف الدوران" : "🔄 تشغيل الدوران"}
        </button>

        <div className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-md px-4 py-2 rounded-lg shadow text-gray-800">
          <h2 className="font-semibold text-lg">{scenes[currentScene].name}</h2>
          <p className="text-sm text-gray-600">{scenes[currentScene].description}</p>
        </div>

        <ThreeJS360Viewer
          panoramaImage={scenes[currentScene].panorama}
          hotspots={scenes[currentScene].hotspots}
          onHotspotClick={handleHotspotClick}
          autoRotate={autoRotate}
          height="100vh"
        />

  
        {infoModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setInfoModal({ open: false, text: "" })} />
            <div className="relative bg-white rounded-lg p-6 z-60 max-w-lg mx-4">
              <h3 className="text-lg font-semibold mb-2">معلومات</h3>
              <p className="text-sm text-gray-700 mb-4">{infoModal.text}</p>
              <div className="text-right">
                <button
                  onClick={() => setInfoModal({ open: false, text: "" })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VirtualTourPage;
