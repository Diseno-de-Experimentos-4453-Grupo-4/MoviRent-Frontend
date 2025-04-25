<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '../../api'

const props = defineProps({
  scooterId: {
    type: Number,
    required: true,
  },
})

const reviews = ref([])
const loading = ref(false)
const error = ref(null)

const fetchReviews = async () => {
  if (!props.scooterId) return

  loading.value = true
  error.value = null

  try {
    const response = await api.get(`/Rate/scooter?scooterId=${props.scooterId}`)
    const reviewsData = response.data

    reviews.value = await Promise.all(
      reviewsData.map(async (review) => {
        try {
          const profileResponse = await api.get(`/Profile/${review.scooterId}`) // En backend, parece que hay un error en la data que devuelve el endpoint de las reseñas, el valor de scooterId debería ser el id del usuario que hizo la reseña, no el del scooter
          const profile = profileResponse.data


          const userName = profile ? `${profile.fullName || 'Usuario Anónimo'}` : 'Usuario Anónimo'

          return {
            ...review,
            userName,
          }
        } catch (err) {
          console.error('Error al obtener perfil de usuario:', err)
          return {
            ...review,
            userName: 'Usuario Anónimo',
          }
        }
      }),
    )
  } catch (err) {
    console.error('Error al obtener reseñas:', err)
    error.value = 'No se pudieron cargar las reseñas'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReviews()
})

watch(
  () => props.scooterId,
  () => {
    fetchReviews()
  },
)

const getStars = (rating) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
</script>

<template>
  <div class="reviews-container">
    <h3 class="text-xl font-bold mb-3">Reseñas</h3>

    <div v-if="loading" class="loading-message">
      <ProgressSpinner style="width: 50px; height: 50px" />
      <p>Cargando reseñas...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="reviews.length === 0" class="no-reviews-message">
      No hay reseñas disponibles para este scooter.
    </div>

    <ScrollPanel v-else class="reviews-panel">
      <div class="reviews-list">
        <Card v-for="review in reviews" :key="review.id" class="review-card mb-3">
          <template #header>
            <div class="review-header">
              <div class="review-user">{{ review.userName }}</div>
              <div class="review-rating">{{ getStars(review.starNumb) }}</div>
            </div>
          </template>
          <template #content>
            <div class="review-content">
              {{ review.comment }}
            </div>
          </template>
        </Card>
      </div>
    </ScrollPanel>
  </div>
</template>

<style scoped>
.reviews-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.reviews-panel {
  height: 400px;
  width: 100%;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
}

.review-card {
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}

.review-user {
  font-weight: 600;
}

.review-rating {
  color: #f59e0b;
  letter-spacing: 2px;
}

.review-content {
  padding: 1rem;
}

.loading-message,
.error-message,
.no-reviews-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  height: 200px;
  border-radius: 8px;
}
</style>
