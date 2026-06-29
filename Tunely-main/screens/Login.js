import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginPage() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loginBox, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Welcome to Tunely</Text>
        <Text style={styles.subtitle}>Your personalized music experience</Text>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("SignUp")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>Create an Account</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.orText}>Already have an account?</Text>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("LoginFormPage")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Log In
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
  },
  loginBox: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#182952",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F1F1F1",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#F1F1F1",
    opacity: 0.8,
    marginBottom: 25,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#213555",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F1F1F1",
  },
  secondaryButton: {
    backgroundColor: "#F1F1F1",
  },
  secondaryButtonText: {
    color: "#213555",
  },
  orText: {
    marginVertical: 15,
    color: "#F1F1F1",
    fontSize: 14,
    opacity: 0.7,
  },
});
