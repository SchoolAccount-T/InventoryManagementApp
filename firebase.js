// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV0DePkT4NOyJJUIejSBo3Af-uoPI5Bno",
  authDomain: "inventory-management-49ba3.firebaseapp.com",
  projectId: "inventory-management-49ba3",
  storageBucket: "inventory-management-49ba3.appspot.com",
  messagingSenderId: "2214070827",
  appId: "1:2214070827:web:23d58598de89b7d062786e",
  measurementId: "G-YB3XKEGJQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore}