<template>
    <div class="tutorial">
      <swiper
        :space-between="50"
        :pagination="{ clickable: true, type: 'fraction' }"
        :slides-per-view="1"
        grab-cursor
      >
        <swiper-slide>
          <h1>유튜브를 가장 재미있게 보는 법</h1>
          <h2>Suber에 오신 것을 환영합니다!</h2>
          <p>Suber는 계획적인 유튜브 사용을 도와주는 서비스입니다.</p>
        </swiper-slide>
  
        <swiper-slide>
          <h1>기능을 간단하게 설명드릴께요!</h1>
          <h2>Dive, 유튜브 시청 시각 설정</h2>
          <ol>
            <li>우선 언제, 얼마나 유튜브를 볼 지 설정합니다.</li>
          </ol>
        </swiper-slide>
  
        <swiper-slide>
          <h2>Dive 중…</h2>
          <ol>
            <li>그 때까지 쾌락을 위한 유튜브를 사용하지 마세요! 충동이 생긴다면, 설정한 유튜브 시청 시간에 볼 영상들을 바구니에 담아주세요!</li>
          </ol>
        </swiper-slide>
  
        <swiper-slide>
          <h2>Dive 완료!</h2>
          <ol>
            <li>축하해요! 이제 유튜브를 볼 시간이에요. 목표한 시간만큼 유튜브를 시청하고 dive를 종료하세요!</li>
            <li>다음 dive를 설정하세요!</li>
          </ol>
          <button @click="finishTutorial">첫 dive 설정하기!</button>
        </swiper-slide>
      </swiper>
    </div>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/swiper-bundle.css';
  import { getFirestore, doc, setDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  export default {
    components: {
      Swiper,
      SwiperSlide
    },
    methods: {
      async finishTutorial() {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (user) {
          const userDoc = doc(db, `users/${user.uid}`);
          await setDoc(userDoc, { tutorialSeen: true }, { merge: true });
        }
  
        this.$router.push('/ready');
      }
    }
  };
  </script>
  
  <style scoped>
  .tutorial {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0 20px;
    overflow: hidden; /* 스와이프할 때 화면을 넘어가지 않도록 함 */
  }
  
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
  }
  
  button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  