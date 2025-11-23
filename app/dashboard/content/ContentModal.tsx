import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000"; // ← عدل حسب السيرفر
interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  content?: {
    title?: string;
    description?: string;
    type?: string;
    region?: string; 
    image?: string;   
  };
}

const ContentModal = ({ isOpen, onClose, onSave, content }: ContentModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      setTitle(content.title ?? "");
      setDescription(content.description ?? "");
      setType(content.type ?? "");
      setRegion(content.region ?? "");
      setOldImage(content.image || null);
      setImage(null);
    } else {
      setTitle("");
      setDescription("");
      setType("");
      setRegion("");
      setOldImage(null);
      setImage(null);
    }
  }, [content]);

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

    // فقط أرسل الصورة الجديدة إذا تم تغييرها
    if (image) {
      formData.append("image", image);
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>النوع *</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
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

          {/* IMAGE PREVIEW */}
          {oldImage && !image && (
            <div className="old-image-preview">
              <label>الصورة الحالية:</label>
              <img
                src={`${BASE_URL}/uploads/${oldImage}`}
                className="modal-preview-image"
              />
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
