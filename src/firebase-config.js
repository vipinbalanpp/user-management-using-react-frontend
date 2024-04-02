
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMl7PnC-vJQAMThKbtMu5UVptYGVvR0Uc",
  authDomain: "user-management-682ae.firebaseapp.com",
  projectId: "user-management-682ae",
  storageBucket: "user-management-682ae.appspot.com",
  messagingSenderId: "158024781251",
  appId: "1:158024781251:web:864edd7bebf7173c3d4176",
  measurementId: "G-J6NQ24CZBG"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
