<template>
  <button @click="signOutFromGoogleAccount">로그아웃</button>

  <div class="container">
    <div class="channels-container-wrapper">
      <div class="channels-container">
        <div v-for="channel in channels" :key="channel.id" class="channel-card" @click="fetchChannelVideos(channel.id)">
          <img :src="channel.thumbnail" class="channel-thumbnail" />
          <p>{{ channel.title }}</p>
        </div>
        <button v-if="nextPageToken" @click="fetchChannels(nextPageToken)" class="load-more-button">&gt;</button>
      </div>
    </div>
    <div class="videos-container">
      <div v-for="video in videos" :key="video.id" class="video-card" @click="saveVideo(video)">
        <img :src="video.thumbnail" class="video-thumbnail" />
        <p>{{ video.title }}</p>
      </div>
      <div v-for="(message, videoId) in feedbackMessages" :key="videoId" class="feedback-message">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getChannels', 'getChannelNextPageToken', 'getVideos', 'getFeedbackMessages']),
    channels() {
      return this.getChannels;
    },
    nextPageToken() {
      return this.getChannelNextPageToken;
    },
    videos() {
      return this.getVideos;
    },
    feedbackMessages() {
      return this.getFeedbackMessages;
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapActions(['getSubscribedChannelList', 'getChannelVideos', 'saveVideoToDive', 'logOut']),
    async signOutFromGoogleAccount() {
      this.logOut();
    },
    async fetchChannels(pageToken = '') {
      try {
        this.loading = true;
        await this.getSubscribedChannelList();
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
    async saveVideo(video) {
      try {
        await this.saveVideoToDive(video);
      } catch (error) {
        console.error('Error saving video:', error);
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
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
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
  display: block;
  width: 100%;
  margin: 10px 0;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
}

.channel-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin: 0 auto;
}

.video-thumbnail {
  width: 80%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.channel-card p, .video-card p {
  margin-top: 10px;
  font-size: 14px;
}

.feedback-message {
  text-align: center;
  color: green;
  font-weight: bold;
  margin-top: 10px;
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
