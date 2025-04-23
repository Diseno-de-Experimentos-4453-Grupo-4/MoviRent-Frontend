<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ScooterDetailsCard from '../components/scooter-details-card.vue';

const route = useRoute();
const scooterId = route.params.id;
const scooter = ref(null);
const loading = ref(true);

const fetchScooterDetails = () => {
  loading.value = true;
  setTimeout(() => {
    scooter.value = {
      id: scooterId,
      name: 'Scooter Eléctrico Premium',
      brand: 'Xiaomi',
      model: 'Pro 2',
      pricePerHour: 15.99,
      address: 'Av. Principal 123, Distrito 1',
      contact: '999-888-777',
      image: 'https://picsum.photos/800/800'
    };
    loading.value = false;
  }, 500);
};

onMounted(() => {
  fetchScooterDetails();
});
</script>

<template>
  <div class="scooter-details-view">
    <div v-if="loading" class="loading-container flex justify-center items-center p-8">
      <ProgressSpinner class="spinner"/>
      <span class="ml-2">Cargando detalles del scooter...</span>
    </div>
    <ScooterDetailsCard v-else :scooter="scooter" />
  </div>
</template>

<style scoped>
.scooter-details-view {
  min-height: 80vh;
}

.loading-container {
  min-height: 400px;
}
</style>
