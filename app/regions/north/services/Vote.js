const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class VoteService {
  async addVote(userId, contentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, contentId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding vote:', error);
      throw error;
    }
  }

  async getContentVotes(contentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/content/${contentId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting content votes:', error);
      throw error;
    }
  }

  async checkUserVote(userId, contentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/check/${userId}/${contentId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking user vote:', error);
      throw error;
    }
  }

  async getVotesStatus(userId, contentIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/status/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentIds })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting votes status:', error);
      throw error;
    }
  }
}

export default new VoteService();
