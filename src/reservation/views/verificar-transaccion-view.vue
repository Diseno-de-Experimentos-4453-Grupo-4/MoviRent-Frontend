<template>
  <div class="verificar-transaccion-container">
    <h2 class="font-bold text-2xl mb-2">Verifica la transacción</h2>
    <p class="mb-4">El usuario ha solicitado la reserva con la siguiente información de transacción.</p>
    <div v-if="booking" class="card flex bg-[#FFCC00] rounded-lg p-4 mb-4">
      <img :src="booking.scooterImage || 'https://picsum.photos/200/200'" class="w-32 h-32 object-cover rounded mr-4" />
      <div class="flex flex-col justify-center flex-1">
        <div class="font-bold text-lg mb-1">{{ booking.scooterBrand }} {{ booking.scooterModel }}</div>
        <div class="mb-1">Precio por hora: <span class="font-semibold">S/ {{ booking.price }}</span></div>
        <div class="mb-1">Horas reservadas: <span class="font-semibold">{{ booking.hours }}</span></div>
        <div class="mb-1">Persona interesada: <span class="font-semibold">{{ booking.userName }}</span></div>
        <div class="mb-1">Fecha de solicitud: <span class="font-semibold">{{ booking.requestDate }}</span></div>
      </div>
    </div>
    <div v-if="booking" class="mt-6 mb-2 font-bold">Imagen del baucher de la transacción</div>
    <div v-if="booking" class="flex flex-col items-center mb-4">
      <img :src="booking.baucherImage" alt="Baucher de transacción" class="h-full w-full object-contain border-none rounded" />
    </div>
    <div class="flex gap-4 justify-center pt-5">
      <button class="btn-primary" @click="aceptarReserva" :disabled="loading">
        {{ loading ? 'Aceptando...' : 'Aceptar reserva' }}
      </button>
      <button class="btn-secondary" @click="goBack" :disabled="loading">Volver atrás</button>
    </div>
    <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
    <div v-if="success" class="text-green-600 mt-2">Reserva aceptada correctamente.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';

const route = useRoute();
const router = useRouter();
const profileId = route.params.profileId;
const bookingId = route.params.bookingId;

const booking = ref(null);
const loading = ref(false);
const error = ref('');
const success = ref(false);

onMounted(async () => {
  try {
    const response = await api.get(`/Booking/own/state?profileId=${profileId}&statusId=2`);
    const filteredBooking = response.data.find(b => b.id === parseInt(bookingId));
    if (filteredBooking) {
      const scooter = await api.get(`/Scooter/${filteredBooking.scooterId}`);
      const user = await api.get(`/Profile/${filteredBooking.profileId}`);
      booking.value = {
        scooterBrand: scooter.data.brand,
        scooterModel: scooter.data.model,
        scooterImage: scooter.data.image,
        price: scooter.data.price,
        hours: Math.ceil((new Date(filteredBooking.endDate) - new Date(filteredBooking.startDate)) / (1000 * 60 * 60)),
        userName: user.data.fullName,
        requestDate: new Date(filteredBooking.startDate).toLocaleString(),
        baucherImage: filteredBooking.baucher
      };
    } else {
      error.value = 'No se encontró la reserva solicitada.';
    }
  } catch (err) {
    console.error('Error al cargar la reserva:', err);
    error.value = 'No se pudo cargar la información de la reserva.';
  }
});

const aceptarReserva = async () => {
  loading.value = true;
  error.value = '';
  success.value = false;
  try {
    await api.patch('/Booking', {
      id: bookingId,
      statusId: 1
    });
    success.value = true;
    router.push('/estados-reserva');
  } catch (err) {
    console.error('Error al aceptar la reserva:', err);
    error.value = 'Ocurrió un error al aceptar la reserva.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.verificar-transaccion-container {
  width: 75%;
  margin: 2rem auto;
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}
.card {
  min-height: 140px;
  gap: 24px !important;
}
.btn-primary {
  background: #FFCC00;
  color: #222;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  width: 366px;
}
.btn-secondary {
  background: #eee;
  color: #333;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  width: 366px;
}
.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
