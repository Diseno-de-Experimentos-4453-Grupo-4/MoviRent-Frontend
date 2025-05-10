<template>
  <div class="reservation-status-view">
    <div class="header">
      <h1>Estados de reserva</h1>
      <h2>Revisa los estados de reserva de tus scooters</h2>
    </div>

    <div v-if="loading" class="loading">
      Cargando estados de reserva...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="scooters-grid">
      <div
        v-for="scooter in scootersWithStatus"
        :key="scooter.id"
        :class="['scooter-card', getStatusClass(scooter.status)]"
      >
        <div class="scooter-image">
          <img :src="scooter.image || 'https://via.placeholder.com/150'" :alt="scooter.brand">
        </div>
        <div class="scooter-info">
          <h3>{{ scooter.model }} - {{ scooter.brand }}</h3>
          <p class="status">
            <strong>Estado:</strong> {{ getStatusText(scooter.status) }}
          </p>

          <button
            v-if="scooter.status === 'in-progress'"
            class="transaction-button verify"
            @click="verifyTransaction(scooter)"
          >
            Verifica la transacción
          </button>

          <button
            v-if="scooter.status === 'reserved'"
            class="transaction-button details"
            @click="viewTransactionDetails(scooter)"
          >
            Ver detalles de transacción
          </button>
        </div>
      </div>

      <div v-if="scootersWithStatus.length === 0" class="no-scooters">
        No tienes scooters con reservas para mostrar.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router'

const scootersWithStatus = ref([]);
const loading = ref(true);
const error = ref(null);
const profileId = ref(null);
const router = useRouter();
const uncompletedBookings = ref([]);
const completedBookings = ref([]);

const getStatusClass = (status) => {
  switch(status) {
    case 'in-progress': return 'status-in-progress';
    case 'reserved': return 'status-reserved';
    default: return 'status-not-reserved';
  }
};

const getStatusText = (status) => {
  switch(status) {
    case 'in-progress': return 'En proceso';
    case 'reserved': return 'Reservado';
    default: return 'No reservado';
  }
};

const verifyTransaction = (scooter) => {
  const booking = uncompletedBookings.value.find(b => b.scooterId === scooter.id && b.statusId === 2);
  if (booking) {
    router.push({
      name: 'verify-transaction',
      params: { profileId:scooter.profileId, bookingId: booking.id }
    });
  } else {
    alert('No se encontró un booking pendiente para este scooter.');
  }
};

const viewTransactionDetails = (scooter) => {
  const booking = completedBookings.value.find(b => b.scooterId === scooter.id && b.statusId === 1);
  if (booking) {
    router.push({
      name: 'reservation-details',
      params: { profileId: scooter.profileId, bookingId: booking.id }
    });
  } else {
    alert('No se encontró un booking pendiente para este scooter.');
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    const firebaseAuth = getAuth();

    if (firebaseAuth.currentUser) {
      const userEmail = firebaseAuth.currentUser.email;

      const profileResponse = await api.get(`/Profile/${userEmail}`);

      if (profileResponse.data && profileResponse.data.id) {
        profileId.value = profileResponse.data.id;

        const scootersResponse = await api.get(`/Scooter/profile?profileId=${profileId.value}`);
        const userScooters = scootersResponse.data || [];

        const uncompletedBookingsResponse = await api.get(`/Booking/own/state?profileId=${profileId.value}&statusId=2`);
        uncompletedBookings.value = uncompletedBookingsResponse.data || [];

        const completedBookingsResponse = await api.get(`/Booking/own/state?profileId=${profileId.value}&statusId=1`);
        completedBookings.value = completedBookingsResponse.data || [];

        scootersWithStatus.value = userScooters.map(scooter => {
          let status = scooter.isAvailable ? 'not-reserved' : 'reserved';

          const scooterBookings = uncompletedBookings.value.filter(booking => booking.scooterId === scooter.id);


          if (scooterBookings.some(booking => booking.statusId === 2)) {
            status = 'in-progress';
          }

          return {
            ...scooter,
            status,
            bookingId: scooterBookings.length > 0 ? scooterBookings[0].id : null,
            image: scooter.image || null
          };
        });
      } else {
        error.value = "No se encontró información del perfil";
      }
    } else {
      error.value = "Usuario no autenticado";
    }
  } catch (err) {
    console.error("Error cargando estados de reserva:", err);
    error.value = "Error al cargar los estados de reserva: " + err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.reservation-status-view {
  padding: 30px;
  width: 75%;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.header h2 {
  font-size: 1.3rem;
  color: #666;
  font-weight: normal;
  margin-top: 0;
}

.loading, .error-message {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.2rem;
}

.error-message {
  color: #e74c3c;
}

.scooters-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
}

.scooter-card {
  display: flex;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.scooter-card:hover {
  transform: translateY(-5px);
}

.status-reserved {
  background-color: #e3f5e3;
  border-left: 5px solid #4CAF50;
}

.status-in-progress {
  background-color: #fff8e1;
  border-left: 5px solid #FFC107;
}

.status-not-reserved {
  background-color: #f5f5f5;
  border-left: 5px solid #9E9E9E;
}

.scooter-image {
  width: 25%;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
}

.scooter-image img {
  max-width: 100%;
  max-height: 150px;
  object-fit: contain;
}

.scooter-info {
  padding: 20px;
  flex-grow: 1;
}

.scooter-info h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.3rem;
}

.status {
  font-size: 1.1rem;
  margin: 15px 0;
}

.transaction-button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.transaction-button.verify {
  background: #FFC107;
  color: #333;
}

.transaction-button.verify:hover {
  background: #FFB300;
}

.transaction-button.details {
  background: #4CAF50;
  color: white;
}

.transaction-button.details:hover {
  background: #388E3C;
}

.no-scooters {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px;
  color: #666;
  font-style: italic;
  background: #f9f9f9;
  border-radius: 12px;
}
</style>
