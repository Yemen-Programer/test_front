import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000";

const ContentModal = ({ isOpen, onClose, onSave, content }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState(null);
  const [model3d, setModel3d] = useState(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [oldImage, setOldImage] = useState(null);
  const [oldModel3d, setOldModel3d] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMapFields, setShowMapFields] = useState(false);

  const contentTypes = [
    { value: "heritage", label: "المعالم التراثية والأثرية" },
    { value: "intangible-oral", label: "التراث الشفوي" },
    { value: "intangible-crafts", label: "الحرف اليدوية" },
    { value: "intangible-folklore", label: "الفلكلور" },
    { value: "clothing-men", label: "الزي الرجالي" },
    { value: "clothing-women", label: "الزي النسائي" },
    { value: "clothing-boys", label: "زي البنين" },
    { value: "clothing-girls", label: "زي البنات" },
    { value: "food", label: "الأكلات الشعبية" }
  ];

  const regions = [
    { value: "northern", label: "المنطقة الشمالية" },
    { value: "eastern", label: "المنطقة الشرقية" },
    { value: "central", label: "المنطقة الوسطى" },
    { value: "western", label: "المنطقة الغربية" },
    { value: "southern", label: "المنطقة الجنوبية" }
  ];

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setDescription(content.description);
      setType(content.type);
      setRegion(content.region);
      setOldImage(content.image || null);
      setOldModel3d(content.model3d || null);
      setGoogleMapsUrl(content.googleMapsUrl || "");
      setCoordinates(content.coordinates || "");
      setShowMapFields(content.type === 'heritage');
      setImage(null);
      setModel3d(null);
    } else {
      setTitle("");
      setDescription("");
      setType("");
      setRegion("");
      setOldImage(null);
      setOldModel3d(null);
      setGoogleMapsUrl("");
      setCoordinates("");
      setShowMapFields(false);
      setImage(null);
      setModel3d(null);
    }
  }, [content]);

  useEffect(() => {
    setShowMapFields(type === 'heritage');
  }, [type]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!title || !description || !type || !region) {
      alert("يرجى تعبئة جميع الحقول!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("region", region);

  
    if (type === 'heritage') {
      formData.append("googlemapsurl", googleMapsUrl);
      formData.append("coordinates", coordinates);
    }

    // إضافة الصورة إذا تم تغييرها
    if (image) {
      formData.append("image", image);
    }

    // إضافة النموذج ثلاثي الأبعاد إذا تم رفعه
    if (model3d) {
      formData.append("model3d", model3d);
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (e) {
      alert("فشل الحفظ!");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setShowMapFields(selectedType === 'heritage');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <div className="modal-header">
          <h2>{content ? "تعديل المحتوى" : "إضافة محتوى جديد"}</h2>
        </div>

        <div className="modal-content">

          <div className="form-group">
            <label>العنوان *</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label>الوصف *</label>
            <textarea
              className="form-textarea"
              value={description}
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>النوع *</label>
            <select className="form-select" value={type} onChange={handleTypeChange}>
              <option value="">اختر النوع</option>
              {contentTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>المنطقة *</label>
            <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">اختر المنطقة</option>
              {regions.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* حقول خرائط Google - تظهر فقط للمعالم التراثية */}
          {showMapFields && (
            <>
              <div className="form-group">
                <label>رابط خرائط Google</label>
                <input 
                  className="form-input" 
                  value={googleMapsUrl} 
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                />
                <small className="form-help">رابط الموقع على خرائط Google</small>
              </div>

              <div className="form-group">
                <label>الإحداثيات (خط الطول والعرض)</label>
                <input 
                  className="form-input" 
                  value={coordinates} 
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder="24.7136, 46.6753"
                />
                <small className="form-help">الإحداثيات الجغرافية (latitude,longitude)</small>
              </div>
            </>
          )}

          {/* معاينة الصورة الحالية */}
          {oldImage && !image && (
            <div className="old-image-preview">
              <label>الصورة الحالية:</label>
              <img
                src={`${BASE_URL}/uploads/${oldImage}`}
                className="modal-preview-image"
                alt="معاينة الصورة"
              />
            </div>
          )}

          {/* معاينة النموذج ثلاثي الأبعاد الحالي */}
          {oldModel3d && !model3d && (
            <div className="old-model-preview">
              <label>النموذج ثلاثي الأبعاد الحالي:</label>
              <div className="model-info">
                <span>{oldModel3d}</span>
                {/* <small>ملف: {path.extname(oldModel3d).toUpperCase()}</small> */}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>الصورة</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input"
            />
          </div>

          {/* حقل رفع النماذج ثلاثية الأبعاد */}
          <div className="form-group">
            <label>النموذج ثلاثي الأبعاد (OBJ, GLB, GLTF)</label>
            <input
              type="file"
              accept=".obj,.glb,.gltf"
              onChange={(e) => setModel3d(e.target.files[0])}
              className="file-input"
            />
            <small className="form-help">يدعم ملفات OBJ, GLB, GLTF (الحد الأقصى 100MB)</small>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>إلغاء</button>
          <button className="btn-primary" disabled={loading} onClick={handleSave}>
            {loading ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;