import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
//import Database from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBv51mFfQ4qtJEtLCcJNdyQyL-JfTPWEco",
  authDomain: "tankef-67c6b.firebaseapp.com",
  databaseURL: "https://tankef-67c6b-default-rtdb.firebaseio.com",
  projectId: "tankef-67c6b",
  storageBucket: "tankef-67c6b.appspot.com",
  messagingSenderId: "705063859019",
  appId: "1:705063859019:web:60769a79424f9df1bc2ece",
  measurementId: "G-3D608XW6W9",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
