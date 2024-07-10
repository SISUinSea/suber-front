<template>
    <div class="cart-container">
        <button @click="goToDashBoard">DashBoard로 이동</button>
      <h1>저장된 영상</h1>
      <div v-if="videos.length === 0">
        <p>저장된 영상이 없습니다.</p>
      </div>
      <div v-else class="videos-container">
        <div v-for="video in videos" :key="video.id" class="video-card">
          <img :src="video.thumbnail" class="video-thumbnail" />
          <div class="video-info">
            <p>{{ video.title }}</p>
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
    computed: {
      ...mapGetters(['getSavedVideos']),
      videos() {
        return this.getSavedVideos;
      },
    },
    methods: {
      ...mapActions(['fetchSavedVideos', 'deleteVideoFromDive']),
      async deleteVideo(videoId) {
        try {
          await this.deleteVideoFromDive(videoId);
        } catch (error) {
          console.error('Error deleting video:', error);
        }
      },
      async goToSearch() {
        this.$router.push('/search');
      },
      async goToDashBoard() {
        this.$router.push('/dashboard');
      }
    },
    async created() {
      await this.fetchSavedVideos();
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
  