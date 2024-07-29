<template>
  <div class="finish-container">
    <h2>재생목록 생성 완료!</h2>
    <p>유튜브 재생목록 생성을 완료했습니다.</p>
    <p v-if="currentDive">지금부터 {{ formattedEndTime }} 까지 이 페이지로 돌아와서 종료 버튼을 눌러주세요.</p>
    <p>남은 시간: {{ remainingTime }}</p>
    <button @click="handleFinish" :disabled="isLoading">종료!</button>
    <div v-if="isLoading" class="loading-spinner"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      isLoading: false,
      remainingTime: '',
      intervalId: null,
    };
  },
  computed: {
    ...mapGetters(['getCurrentDive', 'getCurrentDiveWatchTime']),
    currentDive() {
      return this.getCurrentDive;
    },
    formattedEndTime() {
      if (!this.currentDive || !this.currentDive.endDiveAt || this.currentDive.watchTime == null) return '';

      const end = this.currentDive.endDiveAt.toDate();
      const watchTimeHours = this.currentDive.watchTime;
      end.setHours(end.getHours() + watchTimeHours);

      const month = end.getMonth() + 1;
      const day = end.getDate();
      const hours = end.getHours();
      const minutes = end.getMinutes();

      return `${month}-${day} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
  },
  methods: {
    ...mapActions(['fetchCurrentDiveDocument', 'updateCurrentDive']),
    async handleFinish() {
      this.isLoading = true;
      try {
        await this.updateCurrentDive({ endedAt: new Date() });
        this.$router.push('/ready');
      } catch (error) {
        console.error('Error ending dive:', error);
        this.$message.error(`Failed to end dive: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    },
    updateRemainingTime() {
      if (!this.currentDive || !this.currentDive.endDiveAt || this.currentDive.watchTime == null) return;

      const end = this.currentDive.endDiveAt.toDate();
      const watchTimeHours = this.currentDive.watchTime;
      end.setHours(end.getHours() + watchTimeHours);

      const now = new Date();
      const remainingMilliseconds = end - now;

      if (remainingMilliseconds <= 0) {
        this.remainingTime = '00:00:00';
        clearInterval(this.intervalId);
      } else {
        const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        this.remainingTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }
    },
    startTimer() {
      this.updateRemainingTime();
      this.intervalId = setInterval(this.updateRemainingTime, 1000);
    },
  },
  async created() {
    await this.fetchCurrentDiveDocument();
    this.startTimer();
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style scoped>
.finish-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: transparent;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  color: #343a40;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.description {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.info, .timer {
  color: #495057;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.highlight {
  color: #007bff;
  font-weight: bold;
}

.finish-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.finish-button:hover:not(:disabled) {
  background-color: #218838;
}

.finish-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
