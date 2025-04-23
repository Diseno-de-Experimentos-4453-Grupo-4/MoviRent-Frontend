<template>
  <div class="my-scooters-view">
    <div class="header">
      <h1>Mis Scooters</h1>
    </div>

    <div class="scooters-horizontal-scroll">
      <div
        v-for="scooter in userScooters"
        :key="scooter.id"
        class="scooter-card"
      >
        <div class="card-header">
          <h2>{{ scooter.modelo }}</h2>
        </div>
        <div class="card-content">
          <p><strong>Batería:</strong> {{ scooter.bateria }}%</p>
          <p><strong>Estado:</strong> {{ scooter.estado }}</p>
          <p v-if="scooter.precio_hora"><strong>Precio/hora:</strong> S/{{ scooter.precio_hora }}</p>
        </div>
        <button class="detail-btn">Ver detalle</button>
      </div>

      <div v-if="userScooters.length === 0" class="no-scooters">
        No tienes scooters registrados.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { getAuth } from 'firebase/auth';

const userScooters = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const response = await api.get(`/scooters?propietario=${user.email}`);
      userScooters.value = response.data;
    }
  } catch (error) {
    console.error("Error cargando scooters:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.my-scooters-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
}

.scooters-horizontal-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
  scrollbar-width: thin;
}

.scooters-horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}
.scooters-horizontal-scroll::-webkit-scrollbar-thumb {
  background: #0066cc;
  border-radius: 4px;
}

.scooter-card {
  min-width: 280px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.scooter-card:hover {
  transform: translateY(-5px);
}

.card-header {
  background-color: #0066cc;
  color: white;
  padding: 15px;
  margin: -15px -15px 15px -15px;
  border-radius: 10px 10px 0 0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.card-content {
  padding: 0 10px;
}

.card-content p {
  margin: 8px 0;
  color: #555;
}

.detail-btn {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.detail-btn:hover {
  background-color: #0052a3;
}

.no-scooters {
  text-align: center;
  width: 100%;
  padding: 40px;
  color: #666;
  font-style: italic;
}
</style>
