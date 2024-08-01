<template>
  <div class="search-container">
    <EnergyBar />

    <div class="top-section">
      <button @click="signOutFromGoogleAccount">로그아웃</button>
      <button @click="goToCart">저장된 영상 보기</button>
    </div>

    <div class="content-container">
      <div class="channels-section">
        <div class="channels-container-wrapper">
          <div class="channels-container">
            <div v-for="channel in channels" :key="channel.id" class="channel-card" @click="fetchChannelVideos(channel.id)">
              <img :src="channel.thumbnail" class="channel-thumbnail" />
              <p>{{ channel.title }}</p>
            </div>
            <button v-if="nextPageToken" @click="fetchChannels(nextPageToken)" class="load-more-button">&gt;</button>
          </div>
        </div>
      </div>

      <div class="videos-section">
        <div class="videos-container">
          <div v-for="video in videos" :key="video.id" class="video-card" @click="saveVideo(video)">
            <img :src="video.thumbnail" class="video-thumbnail" />
            <div class="video-info">
              <p class="video-title">{{ video.title }}</p>
              <p v-if="feedbackMessages[video.id]" class="feedback-message">{{ feedbackMessages[video.id] }}</p>
              <span class="video-duration">{{ formatDuration(video.hours, video.minutes, video.seconds) }}</span>
            </div>
          </div>
          <button v-if="videoNextPageToken" @click="fetchMoreVideos(videoNextPageToken)" class="load-more-button">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import EnergyBar from '@/components/EnergyBar.vue';

export default {
  computed: {
    ...mapGetters([
      'getChannels', 
      'getChannelNextPageToken', 
      'getVideos', 
      'getFeedbackMessages', 
      'getVideoNextPageToken',
      'getCurrentChannelId',
       ]),
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
    currentChannelId() {
      return this.getCurrentChannelId;
    }
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapMutations(['setCurrentChannelId']),
    ...mapActions([
      'getSubscribedChannelList', 
      'getChannelVideos', 
      'saveVideoToDive', 
      'logOut', 
      'reduceEnergy',
      ]),
    async signOutFromGoogleAccount() {
      this.logOut();
    },
    async goToCart() {
      this.$router.push('/cart');
      // this.setPage('cart');
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
    async fetchMoreVideos(pageToken) {
      // console.log("video nexdt page tokn is ", pageToken);
      console.log("current channel id", this.currentChannelId);
      if (this.currentChannelId) { // 현재 채널 ID가 있는지 확인
        await this.fetchChannelVideos(this.currentChannelId, pageToken);
      }
    },
    async fetchChannelVideos(channelId, pageToken = '') {
      try {
        this.loading = true;
        console.log("loading videos from channel...");
        this.setCurrentChannelId(channelId);
        await this.getChannelVideos({ channelId, pageToken });
      } catch (error) {
        console.error('Error fetching channel videos:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async saveVideo(video) {
      try {
        this.loading = true;
        await this.saveVideoToDive(video);
        this.reduceEnergy();
      } catch (error) {
        console.error('Error saving video:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDuration(hours, minutes, seconds) {
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
  },
  created() {
    this.fetchChannels();
  },
  components: {
    EnergyBar,
  }
};
</script>


<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  padding: 20px;
  background-color: transparent;
  box-sizing: border-box;
}

.top-section {
  margin-bottom: 20px;
}

.content-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  padding-right: 20px;
}

.channels-section {
  flex-shrink: 0;
  margin-bottom: 20px;
}

.channels-container-wrapper {
  overflow-x: auto;
  width: 100%;
}

.channels-container {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  white-space: nowrap;
  padding: 10px 0;
}

.videos-section {
  flex-grow: 1;
  overflow-y: auto;
}

.videos-container {
  display: flex;
  flex-direction: column;
}

.channel-card, .video-card {
  width: 100%;
  max-width: 100%;
  margin: 10px 0;
  text-align: left;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.channel-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 50%;
}

.video-thumbnail {
  width: 120px;
  height: 67.5px; /* 16:9 비율 */
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

.video-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.video-title {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: bold;
}

.feedback-message {
  color: green;
  margin: 0;
  font-size: 12px;
}

.load-more-button {
  align-self: center;
  width: 40px;
  height: 40px;
  margin-top: 10px;
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

.video-duration {
  font-size: 12px;
  color: #606060;
}
</style>
