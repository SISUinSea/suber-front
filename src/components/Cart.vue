<template>
  <div class="cart-container">
    <!-- <button @click="goToDashBoard">DashBoard로 이동</button> -->
    <h3>시청할 영상을 선택해주세요.</h3>
    
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

    <button 
      class="confirm-button" 
      :style="confirmButtonStyle" 
      @click="handleConfirm"
    >
      <div class="button-content">{{ confirmButtonText }}</div>
      <div class="button-progress" :style="confirmButtonProgressStyle"></div>
    </button>
    
    <button @click="goToSearch">영상 검색하기</button>
  </div>
</template>




<script>
import { mapGetters, mapActions } from 'vuex';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, collection, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/scripts/firebaseApp';

export default {
  data() {
    return {
      watchTime: 0,
      selected: [],
      currentDive: null,
      diveProgress: 0,
      isDiveCompleted: false,
    };
  },
  computed: {
    ...mapGetters(['getSavedVideos']),
    videos() {
      return this.getSavedVideos.map(video => ({
        ...video,
        selected: video.selected || false,
      }));
    },
    totalSelectedDuration() {
      const totalSeconds = this.selected.reduce((sum, video) => 
        sum + video.hours * 3600 + video.minutes * 60 + video.seconds, 0);
      return (totalSeconds / 3600).toFixed(2);
    },
    progressPercentage() {
      const totalSelectedDuration = parseFloat(this.totalSelectedDuration);
      return Math.min((totalSelectedDuration / this.watchTime) * 100, 100);
    },
    progressColor() {
      const totalSelectedDuration = parseFloat(this.totalSelectedDuration);
      return totalSelectedDuration > this.watchTime ? 'red' : '#007BFF';
    },
    confirmButtonStyle() {
      return {
        width: '100%',
        backgroundColor: this.isDiveCompleted ? '#0000ff' : '#e0e0ff',
        color: '#ffffff',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      };
    },
    confirmButtonProgressStyle() {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${this.diveProgress}%`,
        backgroundColor: '#0000ff',
        transition: 'width 0.5s ease-in-out',
      };
    },
    confirmButtonText() {
      if (this.isDiveCompleted) {
        return 'Dive 종료!';
      } else {
        const remainingTime = this.getRemainingTime();
        return `(${this.diveProgress.toFixed(2)}%) ${this.formatEndTime()} 까지 ${remainingTime} 남았어요.`;
      }
    },
  },
  methods: {
    ...mapActions(['fetchSavedVideos', 'deleteVideoFromDive', 'createPlaylist']),
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
      return `${hours > 0 ? hours + ':' : ''}${minutes >= 10 ? '' : '0'}${minutes > 0 ? minutes + ':' : '0:' }${seconds}`;
    },
    async goToSearch() {
      this.$router.push('/search');
    },
    async goToDashBoard() {
      this.$router.push('/dashboard');
    },
    async fetchDiveDocContent() {
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
              this.currentDive = diveDoc.data();
              this.watchTime = diveDoc.data().watchTime || 0;
              this.calculateDiveProgress();
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
    async fetchCurrentDive() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().currentDiveRef) {
          const diveDoc = await getDoc(userDoc.data().currentDiveRef);
          if (diveDoc.exists()) {
            this.currentDive = diveDoc.data();
            this.calculateDiveProgress();
          }
        }
      }
    },
    calculateDiveProgress() {
      if (!this.currentDive) return;

      const now = new Date();
      const start = this.currentDive.createdAt.toDate();
      const end = this.currentDive.endTime.toDate();

      if (now > end) {
        this.isDiveCompleted = true;
        this.diveProgress = 100;
      } else {
        const total = end - start;
        const elapsed = now - start;
        this.diveProgress = (elapsed / total) * 100;
      }
    },
    getRemainingTime() {
      if (!this.currentDive) return '';

      const now = new Date();
      const end = this.currentDive.endTime.toDate();
      const remaining = end - now;

      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      return `${hours}h ${minutes}m ${seconds}s`;
    },
    formatEndTime() {
      if (!this.currentDive) return '';

      const end = this.currentDive.endTime.toDate();
      const month = end.getMonth() + 1;
      const day = end.getDate();
      const hours = end.getHours();
      const minutes = end.getMinutes();

      return `${month}-${day} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    },
    handleConfirm() {
      console.log('Confirm button clicked');
    },
    async handleConfirm() {
      if (!this.isDiveCompleted) {
        const confirmEnd = await this.$confirm('아직 다이브 종료 시각이 아니에요. 정말 다이브를 지금 종료할까요?', '다이브 종료', {
          confirmButtonText: '예',
          cancelButtonText: '아니오',
          type: 'warning'
        }).catch(() => false);

        if (!confirmEnd) return;
      }

      await this.endDive();
    },

    async endDive() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        // 1. Update current dive document
        await this.updateDiveVideos();

        // 2. Remove selected videos from cart
        await this.removeSelectedVideosFromCart();

        // 3. Create YouTube playlist
        const playlistTitle = `Dive ${new Date().toISOString()}`;
        const videoIds = this.selected.map(video => video.videoId);
        await this.createPlaylist(playlistTitle, videoIds);

        // 4. Update user document
        await this.updateUserDocument();

        // 5. Navigate to dashboard or show completion message
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error ending dive:', error);
        // Show error message to user
        this.$message.error(`Failed to end dive: ${error.message}`);
      }
    },

    async updateDiveVideos() {
      const userDoc = await getDoc(doc(db, 'users', getAuth().currentUser.uid));
      const diveRef = userDoc.data().currentDiveRef;
      
      if (!diveRef) {
        throw new Error('No current dive reference found');
      }

      const diveDoc = await getDoc(diveRef);
      
      if (!diveDoc.exists()) {
        throw new Error('Dive document does not exist');
      }

      const videosCollection = collection(diveRef, 'videos');
      for (const video of this.selected) {
        await addDoc(videosCollection, video);
      }

      // Update dive status if needed
      await updateDoc(diveRef, {
        status: 'completed',
        endedAt: new Date()
      });
    },

    async removeSelectedVideosFromCart() {
      const userRef = doc(db, 'users', getAuth().currentUser.uid);
      const videosCollection = collection(userRef, 'videos');

      for (const video of this.selected) {
        await deleteDoc(doc(videosCollection, video.id));
      }

      // Update local state
      this.videos = this.videos.filter(v => !this.selected.some(s => s.id === v.id));
      this.selected = [];
    },

    async updateUserDocument() {
      const userRef = doc(db, 'users', getAuth().currentUser.uid);
      await updateDoc(userRef, {
        currentDiveRef: null
      });
    },
    async checkAuth() {
      return new Promise((resolve) => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          this.isAuthenticated = !!user;
          resolve(user);
        });
      });
    },
    async initializeComponent() {
      const user = await this.checkAuth();
      if (user) {
        await this.fetchSavedVideos();
        await this.fetchDiveDocContent();
        await this.fetchCurrentDive();
        setInterval(this.calculateDiveProgress, 1000);
      }
    },
  },

  

  async created() {
    await this.initializeComponent();
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

.confirm-button {
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.button-content {
  position: relative;
  z-index: 1;
}

.button-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transition: width 0.5s ease-in-out;
}

</style>
