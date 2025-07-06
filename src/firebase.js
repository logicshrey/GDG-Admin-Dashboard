// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZV0vYRNWr_AZHlTgYM9yQFgQ0swnAaQw",
  authDomain: "gdg-prototype-94201.firebaseapp.com",
  projectId: "gdg-prototype-94201",
  storageBucket: "gdg-prototype-94201.appspot.com",
  messagingSenderId: "1066175967861",
  appId: "1:1066175967861:web:d8eea10312162684acfe3c",
  measurementId: "G-Q8VKSKMTS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
