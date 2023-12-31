import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
//import Database from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyBv51mFfQ4qtJEtLCcJNdyQyL-JfTPWEco",
  authDomain: "tankef-67c6b.firebaseapp.com",
  databaseURL: "https://tankef-67c6b-default-rtdb.firebaseio.com",
  projectId: "tankef-67c6b",
  storageBucket: "tankef-67c6b.appspot.com",
  messagingSenderId: "705063859019",
  appId: "1:705063859019:web:60769a79424f9df1bc2ece",
  measurementId: "G-3D608XW6W9",
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar la autenticación con persistencia de AsyncStorage
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Usar getAuth para obtener la instancia de autenticación
export const auth = getAuth(app);
