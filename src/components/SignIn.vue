<template>
    <div>
      <div>sign in with google</div>
      <img
        @click="signInWithGoogle()"
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
      signInWithGoogle() {
        const auth = getAuth(firebaseApp);
  
        // GoogleAuthProvider 객체 생성 및 Scope 설정
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/youtube');
        provider.addScope('https://www.googleapis.com/auth/youtube.force-ssl');
  
        //      const result = await signInWithPopup(auth, provider);
  
        // Google 로그인 팝업 열기
        signInWithPopup(auth, provider)
          .then((result) => {
            // 구글 로그인 성공 시 처리
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            //          const googleAccessToken = await user.getIdToken();
  
            console.log('Logged in user:', user);
            this.$router.push('/ready');
          })
          .catch((error) => {
            // 구글 로그인 실패 시 처리
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Google login error:', errorCode, errorMessage);
          });
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
  