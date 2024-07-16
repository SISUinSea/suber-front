<template>
  <div class="cart-container">
    <button @click="goToDashBoard">DashBoard로 이동</button>
    <h1>저장된 영상</h1>
    <div v-if="videos.length === 0">
      <p>저장된 영상이 없습니다.</p>
    </div>
    <div v-else class="videos-container">
      <div v-for="video in videos" :key="video.id" class="video-card">
        <input type="checkbox" v-model="video.selected" @change="updateSelectedVideos" class="custom-checkbox"/>
        <img :src="video.thumbnail" class="video-thumbnail" />
        <div class="video-info">
          <p>{{ video.title }}</p>
          <p class="video-duration">{{ formatDuration(video.hours, video.minutes, video.seconds) }}</p>
          <button @click="deleteVideo(video.id)">삭제</button>
        </div>
      </div>
    </div>
    <button @click="goToSearch">영상 검색하기</button>
  </div>
</template>



  
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      selected: [], // 선택된 동영상 리스트 추가
    };
  },
  computed: {
    ...mapGetters(['getSavedVideos']),
    videos() {
      return this.getSavedVideos.map(video => ({
        ...video,
        selected: video.selected || false, // selected 속성 추가
      }));
    },
  },
  methods: {
    ...mapActions(['fetchSavedVideos', 'deleteVideoFromDive']),
    async deleteVideo(videoId) {
      try {
        await this.deleteVideoFromDive(videoId);
        this.updateSelectedVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    },
    updateSelectedVideos() {
      // 직렬화하여 Proxy 객체 제거
      this.selected = JSON.parse(JSON.stringify(this.videos.filter(video => video.selected)));
      console.log(this.selected);
      for (let i = 0; i < this.selected.length; i++) {
        console.log(this.selected[i]);
      }
    },
    formatDuration(hours, minutes, seconds) {
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    async goToSearch() {
      this.$router.push('/search');
    },
    async goToDashBoard() {
      this.$router.push('/dashboard');
    },
  },
  async created() {
    await this.fetchSavedVideos();
    this.updateSelectedVideos();
  },
};
</script>



  
<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
}

.videos-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-card {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  text-align: left;
  box-sizing: border-box;
}

.video-thumbnail {
  width: 150px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.video-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
}

.video-info p {
  margin: 0;
}

.video-duration {
  font-size: 12px;
  color: gray;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #007BFF;
  margin-right: 10px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ddd;
}
</style>
