<template>
  <button @click="signOutFromGoogleAccount">로그아웃</button>
  <button @click="goToCart">저장된 영상 보기</button>

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
        <img :src="video.thumbnailHigh" class="video-thumbnail" />
        <p>{{ video.title }}</p>
        <p v-if="feedbackMessages[video.id]" class="feedback-message">{{ feedbackMessages[video.id] }}</p>
      </div>
      <button v-if="videoNextPageToken" @click="fetchMoreVideos(videoNextPageToken)" class="load-more-button">&gt;</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getChannels', 'getChannelNextPageToken', 'getVideos', 'getFeedbackMessages', 'getVideoNextPageToken']),
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
    videoNextPageToken() {
      return this.getVideoNextPageToken;
    },
  },
  data() {
    return {
      loading: false,
      currentChannelId: null, // 현재 채널 ID를 저장하기 위한 변수 추가
    };
  },
  methods: {
    ...mapActions(['getSubscribedChannelList', 'getChannelVideos', 'saveVideoToDive', 'logOut']),
    async signOutFromGoogleAccount() {
      this.logOut();
    },
    async goToCart() {
      this.$router.push('/cart');
    },
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
    async fetchChannelVideos(channelId, pageToken = '') {
      try {
        this.loading = true;
        this.currentChannelId = channelId; // 현재 채널 ID 저장
        await this.getChannelVideos({ channelId, pageToken });
      } catch (error) {
        console.error('Error fetching channel videos:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchMoreVideos(pageToken) {
      if (this.currentChannelId) { // 현재 채널 ID가 있는지 확인
        await this.fetchChannelVideos(this.currentChannelId, pageToken);
      }
    },
    async saveVideo(video) {
      try {
        this.loading = true;
        await this.saveVideoToDive(video);
      } catch (error) {
        console.error('Error saving video:', error);
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
  color: green;
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
