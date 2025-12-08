"use client";
import { useState } from "react";
import ThreeJS360Viewer from "./vrMain";

const VirtualTourPage = () => {
  const [currentScene, setCurrentScene] = useState("scene1");
  const [autoRotate, setAutoRotate] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, text: "" });
  const [infoModal2, setInfoModal2] = useState({ open: false, image: "" });
  const scenes = {
    scene10: {
      name: "المجلس",
      panorama: "/images/vr/home_8_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene9",
          yaw: -115,
          pitch: 0,
          type: "arrow",
          target: "scene9",
          title: "المدخل",
        }
      ],
    },
    scene9: {
      name: "مدخل المجلس",
      panorama: "/images/vr/home_7_360.png",
      description: ".",
      hotspots: [
        {
          id: "toScene8",
          yaw: 155,
          pitch: 0,
          type: "arrow",
          target: "scene8",
          title: "البئر",
        },
          {
          id: "toScene10",
          yaw: 5,
          pitch: 0,
          type: "arrow",
          target: "scene10",
          title:"المجلس",
        },

      ],
    },
      scene8: {
      name: "البئر",
      panorama: "/images/vr/home_6_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene1",
          yaw: 120,
          pitch: 0,
          type: "arrow",
          target: "scene1",
          title:"الحوي ",
        },
        {
          id: "toScene9",
          yaw: 15,
          pitch: 0,
          type: "arrow",
          target: "scene9",
          title: "المدخل",
        }, 
      ],
    },
    scene7: {
      name: "المطبخ",
      panorama: "/images/vr/home_10_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene1",
          yaw: 110,
          pitch: 0,
          type: "arrow",
          target: "scene1",
          title: "الحوي",
        },

      ],
    },
    scene6: {
      name: "غرفة النساء",
      panorama: "/images/vr/home_9_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene1",
          yaw: -50,
          pitch: 0,
          type: "arrow",
          target: "scene1",
          title: "الحوي ",
        },


      ],
    },
    scene5: {
      name: "قصة ضم الاحساء - بيت البيعة ",
      panorama: "/images/vr/home_5_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene1",
          yaw: -145,
          pitch: 0,
          type: "arrow",
          target: "scene1",
          title: " الحوي  ",
        },
        {
          id: "info2",
          yaw: -95,
          pitch: -5,
          type: "info2",
          info: "images/info/s1.png",
          title: "معلومات",
        },
                {
          id: "info2",
          yaw: -60,
          pitch: -5,
          type: "info2",
          info: "images/info/s2.png",
          title: "معلومات",
        },
          {
          id: "info2",
          yaw: -40,
          pitch: -5,
          type: "info2",
          info: "images/info/s3.png",
          title: "معلومات",
        },
                  {
          id: "info2",
          yaw: -18,
          pitch: -5,
          type: "info2",
          info: "images/info/s4.png",
          title: "معلومات",
        },
          {
          id: "info2",
          yaw: 5,
          pitch: -5,
          type: "info2",
          info: "images/info/s5.png",
          title: "معلومات",
        },
                  {
          id: "info2",
          yaw: 25,
          pitch: -5,
          type: "info2",
          info: "images/info/s6.png",
          title: "معلومات",
        },
                  {
          id: "info2",
          yaw: 48,
          pitch: -5,
          type: "info2",
          info: "images/info/s7.png",
          title: "معلومات",
        },
                  {
          id: "info2",
          yaw: 70,
          pitch: -5,
          type: "info2",
          info: "images/info/s8.png",
          title: "معلومات",
        },
                  {
          id: "info2",
          yaw: 100,
          pitch: -5,
          type: "info2",
          info: "images/info/s9.png",
          title: "معلومات",
        },
      ],
    },
    scene4: {
      name: "الوثائق التاريخية - بيت البيعة",
      panorama: "/images/vr/home_4_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene1",
          yaw: 190,
          pitch: -10,
          type: "arrow",
          target: "scene1",
          title: "الحوي",
        },
        {
          id: "info",
          yaw: 245,
          pitch: -5,
          type: "info2",
          info: "images/info/w1.png",
          title: "معلومات",
        },
        {
          id: "info",
          yaw: 270,
          pitch: -5,
          type: "info2",
          info: "images/info/w2.png",
          title: "معلومات",
        },
        {
          id: "info3",
          yaw: 300,
          pitch: -5,
          type: "info2",
          info: "images/info/w3.png",
          title: "معلومات",
        },
        {
          id: "info4",
          yaw: -38,
          pitch: -5,
          type: "info2",
          info: "images/info/w4.png",
          title: "معلومات",
        },
        {
          id: "info5",
          yaw: -18,
          pitch: -5,
          type: "info2",
          info: "images/info/w5.png",
          title: "معلومات",
        },
        {
          id: "info6",
          yaw: 0,
          pitch: -5,
          type: "info2",
          info: "images/info/w6.png",
          title: "معلومات",
        },
        {
          id: "info7",
          yaw: 48,
          pitch: -5,
          type: "info2",
          info: "images/info/w7.png",
          title: "معلومات",
        },
        {
          id: "info8",
          yaw: 105,
          pitch: -5,
          type: "info2",
          info: "images/info/w8.png",
          title: "معلومات",
        },
         {
          id: "info9",
          yaw: 130,
          pitch: -5,
          type: "info2",
          info: "images/info/w9.png",
          title: "معلومات",
        },

      ],
    },
      scene3: {
      name: "الدار - غرفة النوم ",
      panorama: "/images/vr/home_3_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene2",
          yaw: 185,
          pitch: -10,
          type: "arrow",
          target: "scene2",
          title: "غرفة البيعة",
        },
        {
          id: "info",
          yaw: 120,
          pitch: -5,
          type: "info2",
          info: "images/info/m1.png",
          title: "معلومات",
        },
        {
          id: "info2",
          yaw: 40,
          pitch: -5,
          type: "info",
          info: "هنا بات الملك عبدالعزيز بعد أخذ البيعة من أهالي الأحساء.",
          title: "معلومات",
        },
        {
          id: "info3",
          yaw: -20,
          pitch: 5,
          type: "info2",
          info: "images/info/m2.png",
          title: "معلومات",
        },


      ],
    },
     scene2: {
      name: "غرفة البيعة",
      panorama:"/images/vr/home_2_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene3",
          yaw: 120,
          pitch: -20,
          type: "arrow",
          target: "scene3",
          title: "الدار",
        },
        {
          id: "toScene1",
          yaw: -20,
          pitch: 2,
          type: "arrow",
          target: "scene1",
          title: "الحوي",
        },


      ],
    },
      scene1: {
      name: "الحوي - بيت البيعة ",
      panorama: "/images/vr/home_1_360.png",
      description: "",
      hotspots: [
        {
          id: "toScene2",
          yaw: 50,
          pitch: 0,
          type: "arrow",
          target: "scene2",
          title: "غرفة البيعة",
        },
        {
          id: "toScene4",
          yaw: 320,
          pitch: 0,
          type: "arrow",
          target: "scene4",
          title: "الوثائق التاريخية",
        },
          {
          id: "toScene5",
          yaw: -105,
          pitch: 0,
          type: "arrow",
          target: "scene5",
          title: "قصة ضم الاحساء ",
        },
         {
          id: "toScene6",
          yaw: 80,
          pitch: 0,
          type: "arrow",
          target: "scene6",
          title: "غرفة النساء",
        },
          {
          id: "toScene7",
          yaw: 145,
          pitch: 0,
          type: "arrow",
          target: "scene7",
          title: "المطبخ ",
        },
                  {
          id: "toScene8",
          yaw: 200,
          pitch: 0,
          type: "arrow",
          target: "scene8",
          title: "البئر",
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
    }
    else if (hotspot.type === "info2" && hotspot.info) {
      // عرض مودال بدلاً من alert
      setInfoModal2({ open: true, image: hotspot.info });
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
                  className="py-2 px-6 bg-[#3c1053] text-white font-medium rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition text-sm w-full sm:w-auto"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
                {infoModal2.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="" onClick={() => setInfoModal2({ open: false, image: "" })} />
                       <img src={infoModal2.image}/>
              <div className="text-right">
                <button
                  onClick={() => setInfoModal2({ open: false, image: "" })}
                  className="py-2 px-6 bg-[#3c1053] text-white font-medium rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition text-sm w-full sm:w-auto"
                >
                  إغلاق
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VirtualTourPage;
