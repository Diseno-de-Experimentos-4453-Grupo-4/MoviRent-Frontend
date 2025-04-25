<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ScooterDetailsCard from '../components/scooter-details-card.vue';
import api from '@/api';

const route = useRoute();
const router = useRouter();
const scooterId = route.params.id;
const scooter = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchScooterDetails = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/Scooter/${scooterId}`);
    scooter.value = response.data;
  } catch (err) {
    console.error("Error al cargar los detalles del scooter:", err);
    error.value = "No se pudo cargar el scooter solicitado. Por favor, regrese a la búsqueda.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchScooterDetails();
});

const goBackToSearch = () => {
  router.back();
};
</script>

<template>
  <div class="scooter-details-view">
    <div v-if="loading" class="loading-container flex justify-center items-center p-8">
      <ProgressSpinner class="spinner"/>
      <span class="ml-2">Cargando detalles del scooter...</span>
    </div>

    <div v-else-if="error" class="error-container flex flex-col justify-center items-center p-8">
      <i class="pi pi-exclamation-triangle text-3xl mb-4 text-red-500"></i>
      <span class="text-xl mb-4">{{ error }}</span>
      <Button label="Volver a la búsqueda" @click="goBackToSearch" />
    </div>

    <ScooterDetailsCard v-else-if="scooter" :scooter="scooter" />

    <div v-else class="error-container flex flex-col justify-center items-center p-8">
      <i class="pi pi-exclamation-triangle text-3xl mb-4 text-red-500"></i>
      <span class="text-xl mb-4">No se encontraron datos del scooter. Por favor, regrese a la búsqueda.</span>
      <Button label="Volver a la búsqueda" @click="goBackToSearch" />
    </div>
  </div>
</template>

<style scoped>
.scooter-details-view {
  min-height: 80vh;
}

.loading-container, .error-container {
  min-height: 400px;
}

.error-container {
  flex-direction: column;
  text-align: center;
}
</style>
