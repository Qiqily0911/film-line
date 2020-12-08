// firebase SDK
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyBmbHqONy7XHhbAJgi7XI8Zb6xrKcDQ9NM",
  authDomain: "film-db-9936d.firebaseapp.com",
  databaseURL: "https://film-db-9936d.firebaseio.com",
  projectId: "film-db-9936d",
  storageBucket: "film-db-9936d.appspot.com",
  messagingSenderId: "340728739287",
  appId: "1:340728739287:web:6a5a212fc24c2cd1b18792",
};

// Initialize Firebase
const firebaseSet = firebase.initializeApp(config);
export const firebaseAuth = firebase.auth();
export const firestore = firebaseSet.firestore();

const providerGoogle = new firebase.auth.GoogleAuthProvider();
providerGoogle.setCustomParameters({
  prompt: "select_account",
});

export const googleSignIn = () => firebaseAuth.signInWithPopup(providerGoogle);

var providerFb = new firebase.auth.FacebookAuthProvider();

export const faceBookSignIn = () => firebaseAuth.signInWithPopup(providerFb);

// TMDb api key
export const apiKey = "5c27dca1cd4fca2cefc5c8945cfb1974";

// OMDb api key
export const omdbKey = "1bd03df3";
