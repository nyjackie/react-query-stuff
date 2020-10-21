import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

let enabled = false;

/**
 * Both staging and production shouled be using the same exact config options
 */
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

if (Object.values(config).every(Boolean)) {
  enabled = true;
  firebase.initializeApp(config);
}

/**
 * useFirebaseAuth hook
 * it will be enabled when all config exist in the .env.* files.  To disable
 * while developing locally just make sure you don't have the options in your
 * .env.development or and .env.*.local files
 */
function useFirebaseAuth() {
  const [isSignedIn, setSignedIn] = useState(enabled ? false : true);

  useEffect(() => {
    if (enabled) {
      const unregisterAuthObserver = firebase
        .auth()
        .onAuthStateChanged(user => setSignedIn(!!user));
      return function cleanup() {
        unregisterAuthObserver();
      };
    }
  }, []);

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  return { isSignedIn, firebase, uiConfig };
}

export default useFirebaseAuth;
