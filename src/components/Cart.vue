<template>
    <div class="container">
      <button @click="goToSearch">채널 검색</button>
      <h2>저장된 영상 목록</h2>
      <div class="saved-videos-container">
        <div v-for="video in savedVideos" :key="video.id" class="saved-video-card">
          <img :src="video.thumbnail" class="video-thumbnail" />
          <p>{{ video.title }}</p>
          <button @click="deleteVideo(video.id)">삭제</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters(['getSavedVideos']),
      savedVideos() {
        return this.getSavedVideos;
      },
    },
    methods: {
      ...mapActions(['fetchSavedVideos', 'deleteSavedVideo']),
      async goToSearch() {
        this.$router.go(-1);
      },
      async deleteVideo(videoId) {
        try {
          await this.deleteSavedVideo(videoId);
        } catch (error) {
          console.error('Error deleting video:', error);
        }
      },
    },
    async created() {
      try {
        await this.fetchSavedVideos();
      } catch (error) {
        console.error('Error fetching saved videos:', error);
      }
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .saved-videos-container {
    display: flex;
    flex-direction: column;
  }
  
  .saved-video-card {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .video-thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 8px;
  }
  
  .saved-video-card p {
    flex: 1;
    font-size: 14px;
  }
  
  .saved-video-card button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .saved-video-card button:hover {
    background-color: #ff1a1a;
  }
  </style>
  