import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB_zdtSfit7IGZQ34u0ZHdNRF-pNgTjUPE",
  authDomain: "internship-portal-f3cba.firebaseapp.com",
  projectId: "internship-portal-f3cba",
  storageBucket: "internship-portal-f3cba.appspot.com",
  messagingSenderId: "670753523904",
  appId: "1:670753523904:web:2a11dd17d87037c3890525"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };