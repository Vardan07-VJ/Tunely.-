import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === 'storeClient';

//if expogo return null and cant use google sign in
export const signInWithGoogle = async () => {
  if (isExpoGo) {
    console.log('Google Sign-In is not available in Expo Go');
    return null;
  }
  
  // import the native Google Signin module only when running in a native environment
  const { GoogleSignin, statusCodes } = await import('@react-native-google-signin/google-signin');
  
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    GoogleSignin.configure({
      webClientId: '209540280192-cfv5dseulqeeq95t9vagrhmbt2acfva4.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }
  
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('Sign in successful:', userInfo); // Add logging
    
    const userData = {
      id: userInfo.data.user.id,
      email: userInfo.data.user.email,
      name: userInfo.data.user.name,
      photoUrl: userInfo.data.user.photo,
      givenName: userInfo.data.user.givenName,
      familyName: userInfo.data.user.familyName,
      idToken: userInfo.data.idToken
    };
      
    
    return userData;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign in is in progress already');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available or outdated');
    } else {
      console.error(error);
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  if (isExpoGo) return null;

  try {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    const currentUser = await GoogleSignin.getCurrentUser();
    
    if (currentUser?.user) {
      return {
        id: currentUser.user.id,
        email: currentUser.user.email,
        name: currentUser.user.name,
        photoUrl: currentUser.user.photo,
        givenName: currentUser.user.givenName,
        familyName: currentUser.user.familyName
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
  
 

export const signOut = async () => {
  if (isExpoGo) return;
  
  try {
    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    await GoogleSignin.signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};