<template>
  <div class="cart-container">
    <button @click="goToDashBoard">DashBoard로 이동</button>
    <h1>저장된 영상</h1>
    
    <div v-if="videos.length === 0">
      <p>저장된 영상이 없습니다.</p>
    </div>
    <div v-else class="videos-container">
      <div v-for="video in videos" :key="video.id" class="video-card">
        <input 
          type="checkbox" 
          v-model="video.selected" 
          @change="updateSelectedVideos(video)" 
          class="custom-checkbox"
        />
        <img :src="video.thumbnail" class="video-thumbnail" />
        <div class="video-info">
          <p>{{ video.title }}</p>
          <p class="video-duration">{{ formatDuration(video.hours, video.minutes, video.seconds) }}</p>
          <button @click="deleteVideo(video.id)">삭제</button>
        </div>
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${progressPercentage}%`, backgroundColor: progressColor }"></div>
      </div>
      <p>{{ totalSelectedDuration }} / {{ watchTime }} 시간</p>
    </div>
    <button @click="goToSearch">영상 검색하기</button>
  </div>
</template>



<script>
import { mapGetters, mapActions } from 'vuex';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore'; // Ensure that doc is imported from firebase/firestore
import { db } from '@/scripts/firebaseApp';  // Adjust the import according to your file structure

export default {
  data() {
    return {
      watchTime: 0,
      selected: [],
    };
  },
  computed: {
    ...mapGetters(['getSavedVideos']),
    videos() {
      return this.getSavedVideos.map(video => ({
        ...video,
        selected: video.selected || false, // Ensure each video has a selected property
      }));
    },
    totalSelectedDuration() {
      const totalSeconds = this.selected.reduce((sum, video) => 
        sum + video.hours * 3600 + video.minutes * 60 + video.seconds, 0);
      return (totalSeconds / 3600).toFixed(2); // 시간을 소수점 두 자리까지 반환
    },
    progressPercentage() {
      const totalSelectedDuration = parseFloat(this.totalSelectedDuration);
      return Math.min((totalSelectedDuration / this.watchTime) * 100, 100);
    },
    progressColor() {
      const totalSelectedDuration = parseFloat(this.totalSelectedDuration);
      return totalSelectedDuration > this.watchTime ? 'red' : '#007BFF';
    }
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
    updateSelectedVideos(video) {
      if (video.selected) {
        this.selected.push(video);
      } else {
        this.selected = this.selected.filter(v => v.id !== video.id);
      }
      console.log('Selected videos:', this.selected);
    },
    formatDuration(hours, minutes, seconds) {
      return `${hours > 0 ? hours + ':' : ''}${minutes > 0 ? minutes + ':' : '00:' }${seconds}`;
    },
    async goToSearch() {
      this.$router.push('/search');
    },
    async goToDashBoard() {
      this.$router.push('/dashboard');
    },
    async fetchWatchTime() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const currentDiveRef = userDoc.data().currentDiveRef;
          if (currentDiveRef && currentDiveRef instanceof Object) {
            const diveDoc = await getDoc(currentDiveRef);
            if (diveDoc.exists()) {
              this.watchTime = diveDoc.data().watchTime || 0;
              console.log('watchTime:', this.watchTime); // 디버깅 메시지 추가
            } else {
              console.error('Dive document does not exist.');
            }
          } else {
            console.error('currentDiveRef is not a valid DocumentReference:', currentDiveRef);
          }
        } else {
          console.error('User document does not exist.');
        }
      } else {
        console.error('No authenticated user found.');
      }
    },
  },
  async created() {
    await this.fetchSavedVideos();
    await this.fetchWatchTime();
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

.progress-bar-container {
  width: 100%;
  position: sticky;
  bottom: 0;
  background-color: #f9f9f9;
  z-index: 1000;
  padding: 10px 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress {
  height: 100%;
  width: 0;
  transition: width 0.3s ease, background-color 0.3s ease;
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
  font-size: 14px;
  color: #666;
}

.custom-checkbox {
  width: 25px;
  height: 25px;
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
