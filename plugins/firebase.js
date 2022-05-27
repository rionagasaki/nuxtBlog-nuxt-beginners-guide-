// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYxitTWnDVEs4H7ONcSw-ARi27g7zGs80",
  authDomain: "nuxt-blog-service-7ef16.firebaseapp.com",
  databaseURL: "https://nuxt-blog-service-7ef16-default-rtdb.firebaseio.com",
  projectId: "nuxt-blog-service-7ef16",
  storageBucket: "nuxt-blog-service-7ef16.appspot.com",
  messagingSenderId: "703707673711",
  appId: "1:703707673711:web:ed80ed6677dcf8419f899a",
  measurementId: "G-5GVG3EG2EF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export default(constext, inject)=>{
   inject('firebase', app)
}