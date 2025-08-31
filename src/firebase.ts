import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD_dXT0Pcf_Ron9cyueiPVaPe6nz3hEHNo",
  authDomain: "carcontact-aeaed.firebaseapp.com",
  projectId: "carcontact-aeaed",
  storageBucket: "carcontact-aeaed.appspot.com",
  messagingSenderId: "254427937407",
  appId: "1:254427937407:web:fab811b7528a62c6c85d4a",
  measurementId: "G-6JHJ31T8XP",
};

const app = initializeApp(firebaseConfig);


export { app, getMessaging };
