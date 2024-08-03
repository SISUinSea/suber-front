<template>
  <router-view />
</template>

<script>
import { onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    // 상태를 감시하고, 조건에 따라 페이지를 전환합니다.
    watch(
      () => store.getters.currentEnergy,
      (newEnergy) => {
        if (newEnergy === 0) {
          router.push('/interrupt'); // 에너지가 0일 때 Interrupt 페이지로 이동
        }
      }
    );

    return {};
  }
}
</script>