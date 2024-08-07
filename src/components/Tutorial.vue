<template>
  <div class="tutorial">
    <swiper
      :modules="modules"
      :space-between="50"
      :slides-per-view="1"
      :pagination="{ clickable: true }"
      :grabCursor="true"
      class="mySwiper"
    >
      <swiper-slide>
        <h2>유튜브를 가장 재미있게 보는 법</h2>
        <h3>Suber에 오신 것을 환영합니다!</h3>
        <p>Suber는 계획적인 유튜브 사용을 도와주는 서비스입니다.</p>
      </swiper-slide>

      <swiper-slide>
        <h2>기능을 간단하게 설명드릴께요!</h2>
        <h3>Dive, 유튜브 시청 시각 설정</h3>
        <p>우선 언제, 얼마나 유튜브를 볼 지 설정합니다.</p>
      </swiper-slide>

      <swiper-slide>
        <h2>Dive 중…</h2>
        <p>그 때까지 쾌락을 위한 유튜브를 사용하지 마세요! 충동이 생긴다면, 설정한 유튜브 시청 시간에 볼 영상들을 바구니에 담아주세요!</p>
      </swiper-slide>

      <swiper-slide>
        <h2>Dive 완료!</h2>
        <p>축하해요! 이제 유튜브를 볼 시간이에요. 목표한 시간만큼 유튜브를 시청하고 dive를 종료하세요!</p>
        <p>다음 dive를 설정하세요!</p>
        <button @click="finishTutorial">첫 dive 설정하기!</button>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    return {
      modules: [Pagination, Navigation],
    };
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
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}



.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.swiper-container {
  overflow: hidden;
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