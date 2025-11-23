// services/UserService.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class UserService {
  static async getAll(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });

    const response = await fetch(`${BASE_URL}/users?${params}`);
    if (!response.ok) throw new Error('فشل في جلب البيانات');
    return await response.json();
  }

  static async getById(id) {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('فشل في جلب المستخدم');
    return await response.json();
  }

  static async create(userData) {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('فشل في إنشاء المستخدم');
    return await response.json();
  }

  static async update(id, userData) {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('فشل في تحديث المستخدم');
    return await response.json();
  }

  static async delete(id) {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('فشل في حذف المستخدم');
    return await response.json();
  }

  static async getStats() {
    const response = await fetch(`${BASE_URL}/users/stats`);
    if (!response.ok) throw new Error('فشل في جلب الإحصائيات');
    return await response.json();
  }
}

export default UserService;