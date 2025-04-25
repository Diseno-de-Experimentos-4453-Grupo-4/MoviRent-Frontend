<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReviewCardList from '../components/review-card-list.vue';
import api from '@/api.js'

const route = useRoute();
const router = useRouter();
const scooterId = ref(null);
const scooterData = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  scooterId.value = parseInt(route.params.scooterId || route.query.scooterId);

  if (scooterId.value) {
    try {
      loading.value = true;
      const response = await api.get(`/Scooter/${scooterId.value}`);
      const scooter = response.data;
      if (!scooter) {
        throw new Error('Scooter no encontrado');
      }
      scooterData.value = scooter;
      loading.value = false;

    } catch (err) {
      console.error('Error al obtener datos del scooter:', err);
      error.value = 'No se pudieron cargar los datos del scooter';
      loading.value = false;
    }
  }
});

const goBack = () => {
  router.back()
};

const addNewReview = () => {
  router.push(`/reviews/create/${scooterId.value}`);
};
</script>

<template>
  <div class="reviews-view">
    <div class="container mx-auto p-4">
      <div v-if="!scooterId" class="error-message">
        ID de scooter no proporcionado
      </div>

      <div v-else-if="loading" class="loading-container">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p>Cargando información...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col items-center">
          <h2 class="text-2xl font-bold mb-6">Reseñas</h2>

          <div class="scooter-image-container mb-4">
            <img
              :src="scooterData?.image || 'https://picsum.photos/800/800'"
              alt="Imagen del Scooter"
              class="w-70 h-120 object-cover rounded-lg shadow-md"
            />
          </div>

          <p class="italic text-sm text-center mb-6 max-w-80">
            Recuerda siempre ser respetuoso con los comentarios y opiniones
          </p>

          <Button label="Regresar" icon="pi pi-arrow-left" @click="goBack" class="w-40" />
        </div>

        <div class="flex flex-col">
          <ReviewCardList :scooterId="scooterId" class="flex-grow" />

          <div class="mt-4 flex justify-center">
            <Button
              label="Nueva Reseña"
              icon="pi pi-plus"
              severity="success"
              @click="addNewReview"
              class="w-40"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviews-view {
  min-height: 90vh;
}

.error-message {
  text-align: center;
  padding: 2rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.scooter-image-container {
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: center;
}

:deep(.p-button) {
  color: black;
}
</style>
