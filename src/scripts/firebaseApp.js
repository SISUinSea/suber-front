import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBcfDz5Bw1HtR_rM25qql6iyIEq8CqF-w0",
  authDomain: "suber-2b83a.firebaseapp.com",
  projectId: "suber-2b83a",
  storageBucket: "suber-2b83a.appspot.com",
  messagingSenderId: "810970139156",
  appId: "1:810970139156:web:fec1d7d140607037803501",
  measurementId: "G-R3TRB5J5S1"
};


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
