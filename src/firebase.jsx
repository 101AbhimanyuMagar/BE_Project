// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUfIU8HMLSnGCX-sVEFv3ljEwNN3Ti8zM",
  authDomain: "timetablegenerator-40c25.firebaseapp.com",
  projectId: "timetablegenerator-40c25",
  storageBucket: "timetablegenerator-40c25.appspot.com",
  messagingSenderId: "363735186448",
  appId: "1:363735186448:web:161093601b19626a98de95",
  measurementId: "G-CD342H9FT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);