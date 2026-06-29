import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useAudio } from "../context/AudioContext";
import { styles } from "../styles";

export default function Scrubber() {
  const { sound, isPlaying } = useAudio();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (!sound) return;
    
    // Get initial duration
    const getStatus = async () => {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis);
        setPosition(status.positionMillis);
        setSliderValue(status.positionMillis / status.durationMillis);
      }
    };
    
    getStatus();
    
    let interval;
    if (isPlaying && !isSeeking) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setSliderValue(status.positionMillis / status.durationMillis);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [sound, isPlaying, isSeeking]);

  const formatTime = (millis) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSlidingStart = () => {
    setIsSeeking(true);
  };

  const handleValueChange = (value) => {
    if (isSeeking) {
      setSliderValue(value);
    }
  };

  const handleSlidingComplete = async (value) => {
    if (!sound) return;
    
    const newPosition = Math.floor(value * duration);
    setPosition(newPosition);
    setSliderValue(value);

    try {
      // Calculate the new position in milliseconds
      const newPosition = Math.floor(value * duration);
      

      await sound.setStatusAsync({
        positionMillis: newPosition,
        shouldPlay: isPlaying, // Maintain the current play state
      });
      
      // Update state after successful seek
      setPosition(newPosition);
      setSliderValue(value);
    } catch (error) {
      console.error("Error seeking:", error);
    }
    
    setIsSeeking(false);
  };

    
  return (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        value={sliderValue}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}