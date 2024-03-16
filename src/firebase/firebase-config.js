// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider,getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxvBTUvIMPMa9tKWWPWeTY0OKOenumZgg",
  authDomain: "facturero-app.firebaseapp.com",
  projectId: "facturero-app",
  storageBucket: "facturero-app.appspot.com",
  messagingSenderId: "379660853294",
  appId: "1:379660853294:web:9f258113e07899b4c4ffbf",
  measurementId: "G-9MF6L9CBSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const auth = getAuth(app);
export{app, auth, db, provider,analytics,storage}