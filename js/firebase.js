import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
const firebaseConfig = {
  apiKey: "AIzaSyAII5NbG7hFd0lItCsOwnoVdYWXzc5ztyE",
  authDomain: "evdeki-restoranim-1.firebaseapp.com",
  projectId: "evdeki-restoranim-1",
  storageBucket: "evdeki-restoranim-1.firebasestorage.app",
  messagingSenderId: "238625102318",
  appId: "1:238625102318:web:449783527cdb6fcc8656ff",
  measurementId: "G-EK97FS901E"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);