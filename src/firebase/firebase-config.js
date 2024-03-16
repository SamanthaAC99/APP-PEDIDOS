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
  apiKey: "AIzaSyD9_6Yvcfjr-z7umC-vnsgzTQnM2PC0Vbk",
  authDomain: "conorque-pedidos.firebaseapp.com",
  projectId: "conorque-pedidos",
  storageBucket: "conorque-pedidos.appspot.com",
  messagingSenderId: "1069482426696",
  appId: "1:1069482426696:web:3aff5d96cd4be3ded7b37d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const auth = getAuth(app);
export{app, auth, db, provider,analytics,storage}