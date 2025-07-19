import { initializeApp } from "firebase/app";//used to initialize your firebase app with your project configuraton
import { getFirestore } from "firebase/firestore";//used to access firestore , firebasecloud NOSQL database
import { getAnalytics } from "firebase/analytics";//used to enable google Analytics for your firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBRd4Sg_G7co1xFXti5-0v7cgtuHFQV2sE",
  authDomain: "chat-app-83d09.firebaseapp.com",
  projectId: "chat-app-83d09",
  storageBucket: "chat-app-83d09.appspot.com",
  messagingSenderId: "319043326309",
  appId: "1:319043326309:web:034eddd774636cdd10518c",
  measurementId: "G-J18W9NJB8Y"
};//

// Initialize Firebase
const app = initializeApp(firebaseConfig);//its setup the connection between react app and firebase services
const db = getFirestore(app)//this is your firebase database instance , which youll used to read / write chat message or other data
const analytics = getAnalytics(app);// this enables google analytics for you app , allowing you to track user interaction
export {db}
