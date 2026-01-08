const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class WishlistService {
  async addToWishlist(userId, contentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api//wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: Number(userId), 
          contentId: Number(contentId) 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `خطأ في الخادم: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(userId, contentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: Number(userId), 
          contentId: Number(contentId) 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `خطأ في الخادم: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  async getUserWishlist(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/user/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `خطأ في الخادم: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting user wishlist:', error);
      throw error;
    }
  }

  async checkInWishlist(userId, contentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/check/${userId}/${contentId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `خطأ في الخادم: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  }

  async getWishlistStatus(userId, contentIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/status/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentIds })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `خطأ في الخادم: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting wishlist status:', error);
      throw error;
    }
  }

  async getWishlistCount(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/count/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `خطأ في الخادم: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      throw error;
    }
  }
}

export default new WishlistService();
