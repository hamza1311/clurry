import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import  { initializeApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyBsJy5-ApwhEnMC3jRfB7-9eeVhPdvJkWA",
    authDomain: "clurry.firebaseapp.com",
    projectId: "clurry",
    storageBucket: "clurry.appspot.com",
    messagingSenderId: "93755769061",
    appId: "1:93755769061:web:d8fd48a6dfd3727c8f540c"
};

initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
