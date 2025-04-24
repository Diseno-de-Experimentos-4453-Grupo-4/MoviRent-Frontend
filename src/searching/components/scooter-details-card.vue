<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue'

const props = defineProps({
  scooter: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const hoursToRent = ref(1);

const goBackToSearch = () => {
  router.push('/buscar');
};

</script>

<template>
  <div class="details-container">
    <Card class="scooter-details-card">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col items-center">
            <h2 class="text-xl font-bold mb-4">Detalle del scooter</h2>
            <img :src="scooter.image || 'https://picsum.photos/800/800'" alt="Imagen del Scooter" class="w-70 h-120 object-cover mb-4" />
            <p class="italic text-sm text-center mb-4 py-5 max-w-80">
              Recuerda siempre llevar tu DNI para identificarte con el dueño antes de recoger el scooter
            </p>
            <Button label="Reseñas" class="mb-4" />
            <div class="rental-hours py-5">
              <h3 class="font-semibold mb-2">Horas a alquilar:</h3>
              <div class="flex items-center">
                <InputNumber v-model="hoursToRent" :min="1" :max="24" showButtons class="w-full" />
              </div>
            </div>
          </div>

          <div class="scooter-info flex flex-col  items-center justify-center">
            <div class="info-fields flex-grow gap-8 w-full max-w-md">
              <div class="field mb-3">
                <label class="font-bold">Marca:</label>
                <div>{{ scooter.brand }}</div>
              </div>
              <div class="field mb-3">
                <label class="font-bold">Modelo:</label>
                <div>{{ scooter.model }}</div>
              </div>
              <div class="field mb-3">
                <label class="font-bold">Precio por hora:</label>
                <div>S/ {{ scooter.price }}</div>
              </div>
              <div class="field mb-3">
                <label class="font-bold">Dirección:</label>
                <div>{{ scooter.address }}</div>
              </div>
            </div>

            <div class="action-buttons flex gap-2 justify-center mt-4 w-full">
              <Button label="Alquilar" class="p-button-success" />
              <Button label="Regresar" @click="goBackToSearch" class="p-button-secondary" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.details-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.scooter-details-card {
  background-color: var(--color-secondary-background);
  border-radius: 8px;
}

.field label {
  display: block;
  margin-bottom: 0.25rem;
  color: #555;
}

.rental-hours {
  width: 100%;
  max-width: 200px;
}

.action-buttons button {
  min-width: 120px;
}

.scooter-info {
  padding: 1rem;
}

.info-fields {
  display: flex;
  flex-direction: column;
}

:deep(.p-button) {
  color: black;
}
</style>
