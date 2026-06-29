import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PlaylistButton() {
  const navigation = useNavigation();
  const route = useRoute();
  const isActive = route.name === 'UserPlayList';

  const handlePress = () => {
    if (isActive) {
      navigation.goBack();
    } else {
      navigation.navigate('UserPlayList');
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTabButton]} 
      onPress={handlePress}
    >
      <Text style={styles.tabButtonText}>
        Playlists
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    backgroundColor: "rgba(42, 42, 42, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    height: 36,
  },
  activeTabButton: {
    backgroundColor: "#1D1D1D",
    borderWidth: 1,
    borderColor: "#444",
  },
  tabButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  }
});

