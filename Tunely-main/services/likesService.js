import { auth } from '../Utility/firebaseConfig';
import { API_URL } from '../config/apiConfig';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return {};
  
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const likesService = {
  // Toggle like for a song
  toggleLike: async (songId) => {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_URL}/songs/${songId}/like`, {
      method: 'POST',
      headers
    });
    
    return response.json();
  },
  
  // Check if user liked a song
  checkLiked: async (songId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { liked: false };
      }
      
      const token = await user.getIdToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log(`Checking liked status for song ${songId}`);
      
      const response = await fetch(`${API_URL}/songs/${songId}/like`, {
        headers
      });
      
      if (!response.ok) {
        console.error(`response error`, error);
        return { liked: false };
      }
      
      return response.json();
    } catch (error) {
      console.error('Like check error:', error);
      return { liked: false };
    }
  },
  
  // Get all liked songs
  getLikedSongs: async () => {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_URL}/users/me/likes`, {
      headers
    });
    
    return response.json();
  }
};