import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import fbconfig from "./firebase/firebaseConfig.js";
import { initializeApp } from "firebase/app";

// console.log(fbconfig)

const app = initializeApp(fbconfig);
// const firebaseConfig = {
//   apiKey: "AIzaSyC0Vvm0WZwNbGHqKUe0CM94-jAPvY5TlKY",
//   authDomain: "electronics-repair-shop.firebaseapp.com",
//   projectId: "electronics-repair-shop",
//   storageBucket: "electronics-repair-shop.appspot.com",
//   messagingSenderId: "108029125920",
//   appId: "1:108029125920:web:66b6ededa8a46538dfa345"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
