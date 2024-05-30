<template>
    <button @click="logOut">로그아웃</button>
    <div>
      <h1>호출 결과</h1>
      <button @click="callFunction">Firebase Functions 호출</button>
      <div v-if="response">
        <p>응답: {{ response }}</p>
      </div>

  
      <h1>ID Token</h1>
      <button @click="fetchUserIdToken">ID Token 받아오기</button>
      <div>
        <!-- <p>ID Token: {{ IDToken }}</p> -->
      </div>

      <h1>get UID</h1>
      <button @click="getUID">Execute!</button>
      <div>
        <!-- <p>ID Token: {{ IDToken }}</p> -->
      </div>
    </div>
  </template>
  
  <script>
  import {
    getFunctions,
    httpsCallable,
    connectFunctionsEmulator,
  } from 'firebase/functions';
  import { getAuth, signOut } from "firebase/auth";

  import firebaseApp from '../scripts/firebaseApp.js';
  import { getApp } from 'firebase/app';
  
  // connect with local server
  // const functions = getFunctions(getApp());
  // connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  
  const functions = getFunctions();
  
  export default {
    data() {
      return {
        response: null,
        IDToken: '',
      };
    },
    methods: {
      async callFunction() {
        try {
          const helloWorldCallable = httpsCallable(functions, 'helloworld');
          const result = await helloWorldCallable();
          console.log('button is clicked!');
          // 응답 받은 데이터를 response에 할당
          this.response = result.data.message;
        } catch (error) {
          console.error('Firebase Functions 호출 중 오류 발생:', error);
        }
      },
      fetchUserIdToken() {
        // Initialize Firebase Auth
        const auth = getAuth();
  
        // Get the currently signed-in user
        const user = auth.currentUser;
  
        // Check if the user is signed in
        if (user) {
          // Get the ID token, passing `true` to force refresh the token
          return user
            .getIdToken(true)
            .then((idToken) => {
              console.log('ID Token:', idToken);
              this.IDToken = idToken;
              return idToken; // Return the ID token
            })
            .catch((error) => {
              console.error('Error getting ID token:', error);
              return null; // Return null on error
            });
        } else {
          console.log('No user signed in.');
          return Promise.resolve(null); // Return a resolved promise with null value
        }
      },

      async getUID() {
        try {

            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
              console.log('User is authenticated:', user.uid);
            } else {
              console.log('User is not authenticated.');
            }
            console.log('get UID button is clicked!');
            // const getUIDCallable = httpsCallable(functions, 'verifyusertoken');
            // const result = await getUIDCallable();
            // console.log(result);
        } catch (error) {
            console.error('Firebase Functions 호출 중 오류 발생:', error);
        }
      },
      logOut(){

        const auth = getAuth();
        signOut(auth).then(() => {
          // Sign-out successful.
          this.$router.push('/');

        }).catch((error) => {
          // An error happened.
          console.log(error);
        });
      }
    },
  };
  </script>
  