import { useState, useEffect } from 'react';
import { songService } from '../services/songService';
import { useAudio } from '../context/AudioContext';
import { likesService } from '../services/likesService';

export const useGetSongs = (source = 'all') => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { changePlaylist } = useAudio();

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      // here we put the cases depending on the screen and what songs we want to display. put these methods in the songService.js file 
      switch (source) {
        case 'all':
        default:
          data = await songService.getAllSongs();
          break;
          
          case 'liked':
            data = await likesService.getLikedSongs();
            break;

          case 'my-uploads':
            data = await songService.getMyUploads();
            break;

          case 'recently-played':
            data = await songService.getRecentlyPlayed();
            break;
          
        

      }
      
      setSongs(data);
      changePlaylist(data, source);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching songs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [source]);

  const refreshSongs = () => {
    fetchSongs();
  };

  return {
    songs,
    loading,
    error,
    refreshSongs
  };
};