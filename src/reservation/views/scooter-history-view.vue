<script setup>
import { useRouter } from 'vue-router';
import ScooterHistoryCard from '../components/scooter-history-card.vue';

const router = useRouter();

const goBackToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="scooter-history-view">
    <ScooterHistoryCard />

    <div class="flex justify-center mt-6 mb-10">
      <Button
        label="Regresar"
        icon="pi pi-arrow-left"
        class="p-button-secondary"
        @click="goBackToHome"
      />
    </div>
  </div>
</template>

<style scoped>
.scooter-history-view {
  padding: 1.5rem;
  min-height: 80vh;
}

:deep(.p-button-secondary) {
  min-width: 120px;
}
</style>
