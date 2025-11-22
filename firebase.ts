
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyC3TFz5PfShx7edQb2DDadu1vZpZVC3gzM",
  authDomain: "jdhnft-5fa95.firebaseapp.com",
  projectId: "jdhnft-5fa95",
  storageBucket: "jdhnft-5fa95.firebasestorage.app",
  messagingSenderId: "559597372000",
  appId: "1:559597372000:web:4fd815b4f3d2cb2e34f905",
  measurementId: "G-HK4DYSZM74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
