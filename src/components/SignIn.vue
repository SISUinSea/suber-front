<template>
    <div>
      <div>sign in with google</div>
      <img
        @click="signIn()"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
        alt="google logo"
      />
    </div>
  </template>
  <script>
  import firebaseApp from '../scripts/firebaseApp.js';
  import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  
  export default {
    methods: {
      signIn() {
        this.$store.dispatch('signInWithGoogleAndUpdateUserState');
      },
      
    },
  };
  </script>
  
  <style>
  img {
    width: 100px;
    border: 10px solid gray;
    border-radius: 25%;
    margin: 20px;
  }
  </style>
  