<template>
  <div class="energy-bar-container">
    <div class="energy-bar">
      <div
        class="energy-level"
        :style="{ width: `${(energy / maxEnergy) * 100}%` }"
      ></div>
    </div>
    <div class="energy-label">
      Energy: {{ energy }} / {{ maxEnergy }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['currentEnergy']),
    energy() {
      return this.currentEnergy;
    },
    maxEnergy() {
      return 10; // 초기 에너지 값을 설정
    }
  }
};
</script>

<style scoped>
.energy-bar-container {
  margin-bottom: 20px;
}

.energy-bar {
  width: 100%;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.energy-level {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s;
}

.energy-label {
  margin-top: 5px;
  font-size: 14px;
  text-align: center;
}
</style>
