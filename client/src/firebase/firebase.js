// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyACEkogHCAiW_jBXbRqLZ37Q3ZGV-WRbAA",
    authDomain: "designx-600c5.firebaseapp.com",
    projectId: "designx-600c5",
    storageBucket: "designx-600c5.firebasestorage.app",
    messagingSenderId: "86826711459",
    appId: "1:86826711459:web:1f480c81a3269410ff8216",
    measurementId: "G-1FJXELN5EQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication
const googleProvider = new GoogleAuthProvider(); // Google Auth provider

export { auth, googleProvider };





