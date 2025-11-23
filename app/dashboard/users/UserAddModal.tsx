import React, { useEffect, useState } from "react";

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "user", label: "مستخدم" },
    { value: "Technician", label: "فني" },
    { value: "admin", label: "مدير" }
  ];

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
      setPassword(""); // لا نعرض كلمة المرور الحالية
    } else {
      setName("");
      setEmail("");
      setRole("user");
      setPassword("");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name || !email || (!user && !password)) {
      alert("يرجى تعبئة جميع الحقول الإلزامية!");
      return;
    }

    if (!user && password.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل!");
      return;
    }

    const userData = {
      name,
      email,
      role
    };

    // إضافة كلمة المرور فقط إذا كانت جديدة أو في حالة الإضافة
    if (password) {
      userData.password = password;
    }

    try {
      setLoading(true);
      await onSave(userData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <div className="modal-header">
          <h2>{user ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</h2>
        </div>

        <div className="modal-content">

          <div className="form-group">
            <label>الاسم *</label>
            <input 
              className="form-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div className="form-group">
            <label>البريد الإلكتروني *</label>
            <input 
              type="email"
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>

          <div className="form-group">
            <label>
              كلمة المرور {!user && '*'}
            </label>
            <input 
              type="password"
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder={user ? "اتركها فارغة للحفاظ على كلمة المرور الحالية" : "أدخل كلمة المرور"}
            />
            {user && (
              <small className="form-hint">اتركها فارغة للحفاظ على كلمة المرور الحالية</small>
            )}
          </div>

          <div className="form-group">
            <label>الدور *</label>
            <select 
              className="form-select" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            إلغاء
          </button>
          <button className="btn-primary" disabled={loading} onClick={handleSave}>
            {loading ? "جاري الحفظ..." : (user ? "تحديث" : "إضافة")}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserModal;