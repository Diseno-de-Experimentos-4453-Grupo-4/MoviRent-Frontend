<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../api';
import auth from '../../auth';

const route = useRoute();
const router = useRouter();
const scooterId = ref(null);
const scooterData = ref(null);
const loading = ref(true);
const error = ref(null);
const submitting = ref(false);

const rating = ref(0);
const comment = ref('');

onMounted(async () => {
  scooterId.value = parseInt(route.params.scooterId);

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
  } else {
    error.value = 'ID de scooter no proporcionado';
    loading.value = false;
  }
});

const goBack = () => {
  router.back();
};

const submitReview = async () => {
  if (rating.value === 0) {
    error.value = 'Por favor, selecciona una puntuación';
    return;
  }

  if (!comment.value.trim()) {
    error.value = 'Por favor, escribe un comentario';
    return;
  }

  submitting.value = true;
  error.value = null;

  try {
    const currentUser = await auth.getCurrentUser();

    if (!currentUser) {
      throw new Error('Debes iniciar sesión para enviar una reseña');
    }

    const userEmail = currentUser.email;

    const profileResponse = await api.get(`/Profile/${userEmail}`);



    const profileId = profileResponse.data.id;

    const reviewData = {
      Comment: comment.value,
      StarNumb: rating.value,
      ProfileId: profileId,
      ScooterId: scooterId.value
    };

    await api.post('/Rate', reviewData);

    router.push(`/reviews/${scooterId.value}`);
  } catch (err) {
    console.error('Error al enviar la reseña:', err);
    error.value = 'Error al enviar la reseña. Por favor, inténtalo de nuevo.';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="create-review-view">
    <div class="container mx-auto p-4">
      <div v-if="loading" class="loading-container">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p>Cargando información...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else class="review-form-container">
        <Card class="review-card">
          <template #title>
            <h2 class="text-2xl font-bold">Crear Nueva Reseña</h2>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col items-center">
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
              </div>

              <div class="flex flex-col">
                <div class="mb-4">
                  <label class="block text-lg mb-2">Puntuación:</label>
                  <Rating v-model="rating" :stars="5" :cancel="false" />
                </div>

                <div class="mb-4">
                  <label class="block text-lg mb-2">Comentario:</label>
                  <Textarea
                    v-model="comment"
                    rows="5"
                    class="w-full"
                    placeholder="Escribe tu opinión sobre este scooter..."
                  />
                </div>

                <div class="flex justify-between mt-4">
                  <Button
                    label="Cancelar"
                    severity="secondary"
                    @click="goBack"
                    :disabled="submitting"
                  />
                  <Button
                    label="Enviar"
                    :icon="submitting ? 'pi pi-spinner pi-spin' : 'pi pi-check'"
                    severity="success"
                    @click="submitReview"
                    :disabled="submitting"
                  />
                </div>

                <small v-if="error" class="text-red-500 mt-2">{{ error }}</small>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-review-view {
  min-height: 90vh;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-form-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.review-card {
  background-color: var(--color-secondary-background);
  border-radius: 8px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.error-message {
  text-align: center;
  padding: 2rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  margin: 1rem 0;
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
