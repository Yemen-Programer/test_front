// app/posts/services/api.js
export const apiService = {

  searchContent: async (query) => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/search/content?query=${encodeURIComponent(query)}`);
      return await response.json();
    } catch (error) {
      console.error('Search API error:', error);
      return { success: false, message: 'حدث خطأ في البحث' };
    }
  }
};
