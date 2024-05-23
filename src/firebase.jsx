// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeHUNeUenkEtaoy1ZM76jZU65u00oHuqo",
  authDomain: "time-table-generator-5e46a.firebaseapp.com",
  projectId: "time-table-generator-5e46a",
  storageBucket: "time-table-generator-5e46a.appspot.com",
  messagingSenderId: "265947327872",
  appId: "1:265947327872:web:2d943808ce6beec69ca565",
  measurementId: "G-979PFB4RF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
export {auth, db}
// const analytics = getAnalytics(app);