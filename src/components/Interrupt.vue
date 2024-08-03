<template>
  <div class="interrupt-container">
    <img src="@/assets/starfish.png" alt="Starfish" class="interrupt-image" />
    <p class="interrupt-text">눈이 쉴 수 있게 5초간 눈을 감아주세요..</p>
    <button :disabled="timeLeft > 0" class="interrupt-button" @click="resetEnergy">
      <template v-if="timeLeft > 0">{{ timeLeft }}</template>
      <template v-else>에너지 회복하기</template>
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      timeLeft: 5,
    };
  },
  created() {
    this.startCountdown();
  },
  methods: {
    ...mapActions([
      'resetEnergyLevel',
    ]),
    ...mapGetters([
      'currentEnergy',
    ]),
    startCountdown() {
      const countdownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft -= 1;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);
    },
    resetEnergy() {
      this.resetEnergyLevel();
      this.$router.go(-1);
    }
  },
};
</script>

<style scoped>
.interrupt-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}

.interrupt-image {
  width: 300px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 0px;
  border: transparent;
}

.interrupt-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.interrupt-button {
  background-color: #76c7c0;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.interrupt-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.interrupt-button:not(:disabled):hover {
  background-color: #64b2ad;
}
</style>
