import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFT0DD1azab1t_JsexyFsh-NIk8pywj1c",
  authDomain: "jelena-webstudio.firebaseapp.com",
  projectId: "jelena-webstudio",
  storageBucket: "jelena-webstudio.firebasestorage.app",
  messagingSenderId: "810133467923",
  appId: "1:810133467923:web:6351aabc6ba7364e28a0e6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);