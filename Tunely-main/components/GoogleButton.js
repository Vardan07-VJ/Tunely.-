import React from 'react';
import { Alert, Dimensions } from 'react-native';
import { SocialIcon } from '@rneui/themed';
import Constants from 'expo-constants';
import { signInWithGoogle } from '../Utility/googleAuth';

const GoogleButton = ({ onSignIn }) => {
  const handlePress = async () => {
    if (Constants.executionEnvironment === 'storeClient') {
      Alert.alert('Unavailable', 'Google Sign-In is not available in Expo Go');
      return;
    }
    try {
      const userInfo = await signInWithGoogle();
      if (userInfo && userInfo.id) { 
        if (onSignIn) {
          onSignIn(userInfo);
        }
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      console.error('Google Sign-In error', error);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <SocialIcon
      title='Sign in with Google'
      type='google'
      button
      onPress={handlePress}
      style={{ 
        width: screenWidth * 0.9,  
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: '#4285F4'  
      }}
      underlayColor="#3367D6"  
    />
  );
};

export default GoogleButton;