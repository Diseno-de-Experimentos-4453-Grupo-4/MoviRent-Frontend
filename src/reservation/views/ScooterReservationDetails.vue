<template>
  <div class="detalles-reserva-container">
    <h2 class="font-bold text-2xl mb-2">Detalles de reserva</h2>
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
    <div class="flex justify-center pt-5 gap-4">
      <button class="btn-danger" @click="terminarReserva" :disabled="loading">
        {{ loading ? 'Terminando...' : 'Terminar reserva' }}
      </button>
      <button class="btn-secondary" @click="goBack">Volver atrás</button>
    </div>
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
const error = ref('');
const loading = ref(false);

onMounted(async () => {
  try {
    const response = await api.get(`/Booking/own/state?profileId=${profileId}&statusId=1`);
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
        baucherImage: filteredBooking.baucher,
        scooterId: filteredBooking.scooterId
      };
    } else {
      error.value = 'No se encontró la reserva solicitada.';
    }
  } catch (err) {
    console.error('Error al cargar la reserva:', err);
    error.value = 'No se pudo cargar la información de la reserva.';
  }
});

const goBack = () => {
  router.back();
};

const terminarReserva = async () => {
  loading.value = true;
  error.value = '';
  try {
    await api.delete(`/Booking/${bookingId}`);
    await api.put(`/Scooter/${booking.value.scooterId}`, {
      isAvailable: 1,
      brand: booking.value.scooterBrand,
      model: booking.value.scooterModel,
      image: booking.value.scooterImage,
      street: booking.value.street || '',
      neighborhood: booking.value.neighborhood || '',
      city: booking.value.city || '',
      district: booking.value.district || '',
      bankAccount: booking.value.bankAccount || '',
      profileId: profileId
    });
    router.push('/historial');
  } catch (err) {
    console.error('Error al terminar la reserva:', err);
    error.value = 'Ocurrió un error al terminar la reserva.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.detalles-reserva-container {
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

.btn-danger {
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

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
