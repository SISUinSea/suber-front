<template>
    <div class="container">
      <h2>채널 선택</h2>
      <div class="channels-container-wrapper">
        <div class="channels-container">
          <div v-for="channel in channels" :key="channel.id" class="channel-card" @click="fetchChannelVideos(channel.id)">
            <img :src="channel.thumbnail" class="channel-thumbnail" />
            <p>{{ channel.title }}</p>
          </div>
          <button v-if="nextPageToken" @click="fetchChannels(nextPageToken)" class="load-more-button">&gt;</button>
        </div>
      </div>
      <h2>채널 영상 목록</h2>
      <div class="videos-container">
        <div v-for="video in videos" :key="video.id" class="video-card">
          <img :src="video.thumbnail" class="video-thumbnail" />
          <p>{{ video.title }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters(['getChannels', 'getChannelNextPageToken', 'getVideos']),
      channels() {
        return this.getChannels;
      },
      nextPageToken() {
        return this.getChannelNextPageToken;
      },
      videos() {
        return this.getVideos;
      },
    },
    data() {
      return {
        loading: false,
      };
    },
    methods: {
      ...mapActions(['getSubscribedChannelList', 'getChannelVideos']),
      async fetchChannels(pageToken = '') {
        try {
          this.loading = true;
          await this.getSubscribedChannelList(pageToken);
        } catch (error) {
          console.error('Error fetching channels:', error);
        } finally {
          this.loading = false;
        }
      },
      async fetchChannelVideos(channelId) {
        try {
          this.loading = true;
          await this.getChannelVideos({ channelId });
        } catch (error) {
          console.error('Error fetching channel videos:', error);
        } finally {
          this.loading = false;
        }
      },
    },
    created() {
      this.fetchChannels();
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .channels-container-wrapper {
    overflow-x: auto;
  }
  
  .channels-container {
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding: 10px 0;
  }
  
  .channel-card, .video-card {
    display: inline-block;
    width: 150px;
    margin: 10px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
  }
  
  .channel-thumbnail, .video-thumbnail {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .channel-card p, .video-card p {
    margin-top: 10px;
    font-size: 14px;
  }
  
  .load-more-button {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-left: 10px;
    font-size: 20px;
    text-align: center;
    line-height: 40px;
    background-color: #ccc;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .load-more-button:hover {
    background-color: #bbb;
  }
  </style>
  