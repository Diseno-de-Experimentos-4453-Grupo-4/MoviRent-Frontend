<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { useProfileStore } from '@/stores/profileStore.js'

const router = useRouter();
const bookings = ref([]);
const rentedScooters = ref([]);
const loading = ref(true);
const error = ref(null);
const profileStore = useProfileStore();

onMounted(async () => {
  try {
    loading.value = true;
    const profile = profileStore.getProfile();

    const bookingsResponse = await api.get('/Booking?profileId=' + profile.id);
    bookings.value = bookingsResponse.data;

    const scootersPromises = bookings.value.map(booking =>
      api.get(`/Scooter/${booking.scooterId}`)
    );

    const scootersResponses = await Promise.all(scootersPromises);
    rentedScooters.value = scootersResponses.map(response => response.data);
  } catch (err) {
    console.error("Error al cargar el historial de alquileres:", err);
    error.value = "No se pudo cargar el historial de alquileres";
  } finally {
    loading.value = false;
  }
});

const viewScooterDetails = (scooter) => {
  router.push(`/scooter/${scooter.id}`);
};
</script>

<template>
  <div class="history-card-container">
    <Card class="history-card">
      <template #title>
        <div class="title">
          <h2 class="text-xl font-bold">Historial de scooters alquilados</h2>
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="flex justify-center items-center p-4">
          <ProgressSpinner />
          <span class="ml-2">Cargando historial...</span>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center p-4">
          <i class="pi pi-exclamation-triangle text-3xl mb-2 text-yellow-500"></i>
          <p>{{ error }}</p>
        </div>

        <div v-else-if="rentedScooters.length === 0" class="flex flex-col items-center justify-center p-4">
          <i class="pi pi-info-circle text-3xl mb-2 text-blue-500"></i>
          <p>No tienes scooters alquilados en tu historial.</p>
        </div>

        <div v-else class="grid-container">
          <DataTable :value="rentedScooters" responsiveLayout="scroll">
            <Column field="id" header="ID" :sortable="true" style="width: 10%"></Column>
            <Column header="Imagen" style="width: 20%">
              <template #body="slotProps">
                <img
                  :src="slotProps.data.image || 'https://picsum.photos/800/800'"
                  :alt="slotProps.data.brand + ' ' + slotProps.data.model"
                  class="scooter-image"
                />
              </template>
            </Column>
            <Column field="brand" header="Marca" :sortable="true" style="width: 20%"></Column>
            <Column field="model" header="Modelo" :sortable="true" style="width: 20%"></Column>
            <Column header="Acciones" style="width: 30%">
              <template #body="slotProps">
                <Button
                  label="Ver detalles"
                  class="p-button-primary"
                  @click="viewScooterDetails(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.history-card-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.history-card {
  background-color: var(--color-secondary-background);
  border-radius: 8px;
}

.title {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.scooter-image {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

:deep(.p-button-primary) {
  background-color: greenyellow;
  border: none;
  color: black;
}

.grid-container {
  overflow-x: auto;
}
</style>
