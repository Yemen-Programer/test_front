const BASE_URL = "http://localhost:5000/api/content"; // عدل الرابط إذا لزم

const ContentService = {
  // جلب جميع المحتويات
  getAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch contents");
    return await res.json();
  },
  async getRegionStructure(regionId) {
    try {
      const response = await fetch(`${BASE_URL}/region/${regionId}`);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المنطقة');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching region structure:', error);
      throw error;
    }
  },
  // جلب محتوى حسب ID
  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch content");
    return await res.json();
  },

  // إنشاء محتوى جديد
  create: async (formData) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Failed to create content");
    return await res.json();
  },

  // تحديث محتوى
  update: async (id, formData) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: formData
    });
    if (!res.ok) throw new Error("Failed to update content");
    return await res.json();
  },

  // حذف محتوى
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete content");
    return await res.json();
  }
};

export default ContentService;
