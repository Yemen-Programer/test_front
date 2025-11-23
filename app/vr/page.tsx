"use client";
import { useState } from "react";
import ThreeJS360Viewer from "./vrMain";

const VirtualTourPage = () => {
  const [currentScene, setCurrentScene] = useState("scene10");
  const [autoRotate, setAutoRotate] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, text: "" });

  const scenes = {
    scene12: {
      name: "Water wall",
      panorama: "/images/vr/z_12_360.png",
      description: "المدخل الرئيسي للمتحف، يوضح طراز البناء القديم.",
      hotspots: [
        {
          id: "toScene11",
          yaw: 30,
          pitch: 0,
          type: "arrow",
          target: "scene11",
          title: "القلعة 5",
        },
        {
          id: "info12",
          yaw: 120,
          pitch: -5,
          type: "info",
          info: "هذه المنطقة كانت مخصصة لاستقبال الضيوف في الماضي.",
          title: "معلومات عن المدخل",
        },
      ],
    },
    scene11: {
      name: "القلعة 5 ",
      panorama: "/images/vr/z_11_360.png",
      description: "الفناء الواسع الذي يضم عدة غرف وممرات.",
      hotspots: [
        {
          id: "toScene10",
          yaw: -60,
          pitch: 0,
          type: "arrow",
          target: "scene10",
          title: "القلعة 4 ",
        },
        {
          id: "toScene12",
          yaw: 60,
          pitch: 0,
          type: "arrow",
          target: "scene12",
          title: "Water Wall",
        },
        {
          id: "info2",
          yaw: 180,
          pitch: 5,
          type: "info",
          info: "هذا الجدار تم ترميمه عام 1990 باستخدام مواد أصلية.",
          title: "معلومات عن الجدار",
        },
      ],
    },
      scene10: {
      name: "القلعة 4",
      panorama: "/images/vr/z_10_360.png",
      description: "الفناء الواسع الذي يضم عدة غرف وممرات.",
      hotspots: [
        {
          id: "toScene11",
          yaw: 100,
          pitch: 0,
          type: "arrow",
          target: "scene11",
          title: "القلعة 5 ",
        },
        {
          id: "toScene9",
          yaw: -70,
          pitch: 0,
          type: "arrow",
          target: "scene9",
          title: "القلعة 3",
        },
        {
          id: "info2",
          yaw: 180,
          pitch: 5,
          type: "info",
          info: "هذا الجدار تم ترميمه عام 1990 باستخدام مواد أصلية.",
          title: "معلومات عن الجدار",
        },
      ],
    },
    scene9: {
      name: "القلعة 3",
      panorama: "/images/vr/z_8_360.png",
      description: "الفناء الواسع الذي يضم عدة غرف وممرات.",
      hotspots: [
        {
          id: "toScene10",
          yaw: 1,
          pitch: 0,
          type: "arrow",
          target: "scene10",
          title: "القلعة 4 ",
        },
                {
          id: "toScene8",
          yaw: -40,
          pitch: 0,
          type: "arrow",
          target: "scene8",
          title: "الغرفة وسط القلعة",
        },
           {
          id: "toScene7",
          yaw: 120,
          pitch: 0,
          type: "arrow",
          target: "scene7",
          title: "القلعة 2",
        },

        {
          id: "info2",
          yaw: 180,
          pitch: 5,
          type: "info",
          info: "هذا الجدار تم ترميمه عام 1990 باستخدام مواد أصلية.",
          title: "معلومات عن الجدار",
        },
      ],
    },
    scene8: {
      name: "الغرفة وسط القلعة",
      panorama: "/images/vr/z_9_360.png",
      description: "الفناء الواسع الذي يضم عدة غرف وممرات.",
      hotspots: [
        {
          id: "toScene9",
          yaw: 1,
          pitch: 0,
          type: "arrow",
          target: "scene9",
          title: "القلعة 3 ",
        },

        {
          id: "info2",
          yaw: 180,
          pitch: 5,
          type: "info",
          info: "هذا الجدار تم ترميمه عام 1990 باستخدام مواد أصلية.",
          title: "معلومات عن الجدار",
        },
      ],
    },
    scene7: {
      name: "القلعة الثانية ",
      panorama: "/images/vr/z_7_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene9",
          yaw: 70,
          pitch: 0,
          type: "arrow",
          target: "scene9",
          title: "القلعة 3 ",
        },
        {
          id: "toScene6",
          yaw: 130,
          pitch: 0,
          type: "arrow",
          target: "scene6",
          title: "الغرفة الجنوبية ",
        },
        {
          id: "toScene5",
          yaw: -180,
          pitch: 0,
          type: "arrow",
          target: "scene5",
          title: "القلعة 1",
        },
        {
          id: "info2",
          yaw: 100,
          pitch: -10,
          type: "info",
          info: "يوجد في ساحة القلعة حوض منحوت لحفظ المياة في أرضية القلعة الصخرية مقابل المدخل مباشرة وهو مربع الشكل طول ضلعه 1,60 م وبعمق متر واحد",
          title: "معلومات عن البئر",
        },
      ],
    },
    scene6: {
      name: "الغرفة الجنوبية",
      panorama: "/images/vr/z_13_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene7",
          yaw: 50,
          pitch: 0,
          type: "arrow",
          target: "scene7",
          title: "القلعة 2 ",
        },

        {
          id: "info2",
          yaw: 100,
          pitch: -10,
          type: "info",
          info:"تقع بجوار المدخل على الجدار الجنوبي للقلعة يبلغ طولها 8,20 م وعرضها 3,80 م ",
          title: "معلومات عن الغرفة",
        },
      ],
    },
        scene5: {
      name: "القلعة 1",
      panorama: "/images/vr/z_6_2_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene4",
          yaw: 20,
          pitch: -60,
          type: "arrow",
          target: "scene4",
          title: "الدرج",
        },
        {
          id: "toScene9",
          yaw: -60,
          pitch: 10,
          type: "arrow",
          target: "scene7",
          title: "القلعة 2",
        },


      ],
    },
     scene4: {
      name: "الدرج",
      panorama: "/images/vr/z_4_4_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene5",
          yaw: -0,
          pitch: 10,
          type: "arrow",
          target: "scene5",
          title: "قلعة 1",
        },
        {
          id: "toScene3",
                    yaw: 170,
          pitch: -30,
          type: "arrow",
          target: "scene3",
          title: "المدخل",
        },


      ],
    },
      scene3: {
      name: "مدخل القلعة ",
      panorama: "/images/vr/z_3_3_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene4",
          yaw: 55,
          pitch: 0,
          type: "arrow",
          target: "scene4",
          title: "الدرج",
        },

      ],
    },
  };

  const handleHotspotClick = (hotspot) => {
    // حماية ضد undefined
    if (!hotspot || typeof hotspot !== "object") {
      console.warn("handleHotspotClick: invalid hotspot:", hotspot);
      return;
    }

    if (hotspot.type === "arrow" && hotspot.target) {
      // إذا الوجه موجود ننتقل للمشهد الهدف
      if (scenes[hotspot.target]) {
        setCurrentScene(hotspot.target);
      } else {
        console.warn("Target scene does not exist:", hotspot.target);
      }
    } else if (hotspot.type === "info" && hotspot.info) {
      // عرض مودال بدلاً من alert
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

        {/* Simple Modal for info */}
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
