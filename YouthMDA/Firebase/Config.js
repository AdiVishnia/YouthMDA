// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';

// Firebase config with hardcoded values
const firebaseConfig = {
  apiKey: "AIzaSyCz6tVWi-xrc_ekvymQjp79rDmCxO9ekeM",
  authDomain: "projectmda-70284.firebaseapp.com",
  projectId: "projectmda-70284",
  storageBucket: "projectmda-70284.firebasestorage.app",
  messagingSenderId: "1095907159368",
  appId: "1:1095907159368:web:ca60753b29dc17344a177d",
  measurementId: "G-HM7HFEXXSL"
};

// Ensure Firebase is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use simple auth initialization
const auth = getAuth(app);

const db = getFirestore(app);

// Function to fetch user data from Firestore
const getUserData = async (userId) => {
  try {
    const userDocRef = doc(collection(db, 'users'), userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.warn('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Export everything at once
export { auth, db, getUserData };

