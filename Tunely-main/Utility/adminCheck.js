import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { API_URL } from '../config/apiConfig';

//using this file in loginformpage.js as "authcheck"
export default function AdminCheck({ navigation }) {
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        navigation.replace('Login');
        return;
      }

      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_URL}/admin/check`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.isAdmin) {
        // User is an admin, redirect to admin page
        navigation.replace('AdminPage');
      } else {
        // User is not an admin, redirect to normal home
        navigation.replace('Home');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setError('Could not verify admin status');
      // Default to regular home on error
      setTimeout(() => navigation.replace('Home'), 2000);
    } finally {
      setChecking(false);
    }
  };

  return null;
}