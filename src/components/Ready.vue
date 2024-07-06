<template>
  <div class="container">
    <h2>다이브 설정</h2>
    
    <div v-if="step === 1" class="step-container">
      <div class="input-group">
        <label for="date">날짜 선택:</label>
        <input type="date" v-model="selectedDate" id="date" class="input">
      </div>
      
      <div class="input-group">
        <label for="time">시간 선택:</label>
        <input type="time" v-model="selectedTime" id="time" class="input">
      </div>
      
      <button @click="nextStep" class="button">다음</button>
    </div>

    <div v-if="step === 2" class="step-container">
      <p>날짜와 시간을 다시 선택하시려면 <a @click="previousStep" href="#" class="link">여기</a>를 클릭하세요.</p>
      
      <p>다음 문장을 입력하세요:</p>
      
      <div class="input-feedback">
        <span v-for="(char, index) in targetString" :key="index" :class="getCharClass(index)">
          {{ char }}
        </span>
      </div>
      
      <input type="text" v-model="userString" @input="checkString" class="input">
      
      <button :disabled="!isStringMatched" @click="createDive" class="button" :class="{ disabled: !isStringMatched }">확인</button>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import router from "../router";

export default {
  data() {
    return {
      step: 1,
      selectedDate: "",
      selectedTime: "",
      userString: "",
      isStringMatched: false,
    };
  },
  computed: {
    formattedDate() {
      return this.selectedDate.replace(/-/g, "/");
    },
    formattedTime() {
      return this.selectedTime;
    },
    targetString() {
      return `나는 ${this.formattedDate} ${this.formattedTime} 까지 쾌락을 위한 유튜브 영상을 시청하지 않겠습니다.`;
    }
  },
  methods: {
    nextStep() {
      if (this.selectedDate && this.selectedTime) {
        this.step = 2;
      } else {
        alert("날짜와 시간을 선택해주세요.");
      }
    },
    previousStep() {
      this.step = 1;
    },
    checkString() {
      this.isStringMatched = this.userString === this.targetString;
    },
    getCharClass(index) {
      if (index < this.userString.length) {
        return this.userString[index] === this.targetString[index] ? 'correct' : 'incorrect';
      } else {
        return 'pending';
      }
    },
    async createDive() {
      if (!this.isStringMatched) {
        alert("문장을 정확히 입력해주세요.");
        return;
      }

      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userRef = doc(db, "users", user.uid);
          const divesRef = collection(userRef, "dives");
          await addDoc(divesRef, {
            createdAt: serverTimestamp(),
            endDate: this.selectedDate,
            endTime: this.selectedTime,
            watchTimeAfterDive: 0,
            videos: [],
            finalVideos: []
          });
          alert("Dive 설정이 완료되었습니다.");
          router.push("/ready");
        } else {
          alert("로그인이 필요합니다.");
        }
      } catch (error) {
        console.error("Error creating dive:", error);
        alert("다이브 설정 중 오류가 발생했습니다.");
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  color: #333;
}

.step-container {
  margin: 20px 0;
}

.input-group {
  margin-bottom: 15px;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input {
  width: calc(100% - 10px);
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.button.disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.link {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.target-string {
  font-weight: bold;
  margin-bottom: 10px;
}

.input-feedback {
  margin-bottom: 10px;
  font-size: 16px;
  color: #ccc;
  white-space: pre-wrap;
}

.correct {
  color: #000;
}

.incorrect {
  color: red;
}

.pending {
  color: #ccc;
}

p {
  margin: 10px 0;
}
</style>
