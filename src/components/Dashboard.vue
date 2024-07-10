<template>
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div class="info-cards">
        <div class="card">
          <h2>남은 기한</h2>
          <p>{{ remainingDays }}일 남음</p>
        </div>
        <div class="card">
          <h2>진행 상황</h2>
          <p>{{ progress }}%</p>
        </div>
        <div class="card">
          <h2>빈번한 사용</h2>
          <p>{{ frequentUsage }}회</p>
        </div>
        <div class="card">
          <h2>전체 사용 시간</h2>
          <p>{{ totalUsageTime }}시간</p>
        </div>
      </div>
      <div class="buttons">
        <button @click="goToCart">내 영상 Cart</button>
        <button @click="goToSearch">Search 페이지</button>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        remainingDays: 0, // 데이터 예시, 실제 데이터로 대체 필요
        progress: 0, // 데이터 예시, 실제 데이터로 대체 필요
        frequentUsage: 0, // 데이터 예시, 실제 데이터로 대체 필요
        totalUsageTime: 0 // 데이터 예시, 실제 데이터로 대체 필요
      };
    },
    computed: {
      ...mapGetters(['getRemainingDays', 'getProgress', 'getFrequentUsage', 'getTotalUsageTime']),
      remainingDays() {
        return this.getRemainingDays;
      },
      progress() {
        return this.getProgress;
      },
      frequentUsage() {
        return this.getFrequentUsage;
      },
      totalUsageTime() {
        return this.getTotalUsageTime;
      }
    },
    methods: {
      ...mapActions(['fetchDashboardData']),
      goToCart() {
        this.$router.push('/cart');
      },
      goToSearch() {
        this.$router.push('/search');
      }
    },
    created() {
      this.fetchDashboardData();
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .info-cards {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  
  .card {
    width: 45%;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
  }
  
  .buttons {
    text-align: center;
  }
  
  button {
    margin: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  