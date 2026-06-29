import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, 
  signOut as firebaseSignOut } from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getFirestore } from 'firebase/firestore'; 
import { FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID, 
  FIREBASE_MEASUREMENT_ID } from '@env';



  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const firestore = getFirestore(app); 


// Sign up with email and password
export const signUpWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
export const signInWithEmailAndPassword = (email, password) => {
  return firebaseSignInWithEmailAndPassword(auth, email, password);
};

// Fetch user data (username and profile picture)
export const getUserData = async (userId) => {
  try {
    const userRef = ref(database, 'users/' + userId);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Update user data (e.g., username and profile picture URL)
export const updateUserData = async (userId, data) => {
  try {
    const userRef = ref(database, 'users/' + userId);
    await set(userRef, data);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// Upload profile picture to Firebase Storage
export const uploadProfilePicture = async (userId, uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
    await uploadBytes(profilePicRef, blob);
    const downloadURL = await getDownloadURL(profilePicRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
  }
};

// Upload any file (image or song) to Firebase Storage
export const uploadFile = async (userId, fileUri, type) => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const fileRef = storageRef(storage, `${type}/${userId}/${Date.now()}`);
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

// Add song data to Firestore
export const addSongToDatabase = async (songData) => {
  try {
    const songRef = doc(firestore, 'songs', `${songData.userId}_${Date.now()}`);
    await setDoc(songRef, songData);
  } catch (error) {
    console.error("Error adding song to database:", error);
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export { auth, database, storage, firestore };
export default app;
