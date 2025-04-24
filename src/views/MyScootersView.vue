<template>
  <div class="my-scooters-view">
    <div class="header">
      <h1>Mis Scooters</h1>
      <button @click="goToAddScooter" class="add-scooter-button">
        <span class="icon">+</span> Agregar Scooter
      </button>
    </div>

    <div class="scooters-horizontal-scroll">
      <div
        v-for="scooter in userScooters"
        :key="scooter.id"
        class="scooter-card"
      >
        <div class="card-header">
          <h2>{{ scooter.model }}</h2>
        </div>
        <div class="card-content">
          <p><strong>Estado:</strong> {{ scooter.state }}</p>
          <p><strong>Marca:</strong> {{ scooter.brand }}</p>
          <p v-if="scooter.price"><strong>Precio/hora:</strong> S/{{ scooter.price }}</p>
          <p><strong>Direccion:</strong> {{ scooter.address }}</p>
          <p><strong>Contacto:</strong> {{ scooter.phoneNumber }}</p>
        </div>
        <button class="detail-btn" @click="viewScooterDetails(scooter)">Ver detalle</button>
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
import { useRouter } from 'vue-router';
import { useScooterStore } from '@/stores/scooterStore';

const userScooters = ref([]);
const loading = ref(true);
const router = useRouter();
const error = ref(null);
const scooters = ref([]);
const scooterStore = useScooterStore();

const goToAddScooter = () => {
  router.push('/publicar-scooter');
};

const viewScooterDetails = (scooter) => {
  const scooterData = {
    id: scooter.id,
    model: scooter.modelo,
    brand: scooter.marca,
    price: scooter.precio_hora,
    address: scooter.direccion,
    isAvailable: scooter.estado === "Disponible"
  };

  scooterStore.setSelectedScooter(scooterData);

  router.push(`/scooter/${scooter.id}`);
};

onMounted(async () => {
  try {
    loading.value = true;
    const firebaseAuth = getAuth();

    if (firebaseAuth.currentUser) {
      const userEmail = firebaseAuth.currentUser.email;

      const profileResponse = await api.get(`Profile/${userEmail}`);

      if (profileResponse.data && profileResponse.data.id) {
        const scootersResponse = await api.get(`Scooter/profile?profileId=${profileResponse.data.id}`);

        userScooters.value = (scootersResponse.data || []).map(scooter => ({
          id: scooter.id,
          model: scooter.model,
          brand: scooter.brand,
          price: scooter.price,
          address: `${scooter.address}`,
          state: scooter.isAvailable ? "Disponible" : "No disponible",
          phoneNumber: profileResponse.data.phoneNumber || "No especificado"
        }));
        scooterStore.setScooters(userScooters.value);
      } else {
        error.value = "No se encontró información del perfil";
      }
    } else {
      error.value = "Usuario no autenticado";
    }
  } catch (err) {
    console.error("Error cargando scooters:", err);
    error.value = "Error al cargar los scooters: " + err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.my-scooters-view {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.add-scooter-button {
  background: linear-gradient(135deg, #0066cc, #004d99);
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.add-scooter-button:hover {
  background: linear-gradient(135deg, #004d99, #003366);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
}

.add-scooter-button .icon {
  font-size: 1.2rem;
}

.scooters-horizontal-scroll {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding-bottom: 25px;
  scrollbar-width: thin;
  min-height: 300px;
}

.scooters-horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.scooters-horizontal-scroll::-webkit-scrollbar-thumb {
  background: #0066cc;
  border-radius: 4px;
}


.scooter-card {
  min-width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  padding: 0;
  transition: all 0.3s ease;
  flex-shrink: 0;
  overflow: hidden;
}

.scooter-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.card-header {
  background: linear-gradient(135deg, #0066cc, #004d99);
  color: white;
  padding: 18px;
  margin: 0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.card-content {
  padding: 18px;
}

.card-content p {
  margin: 10px 0;
  color: #555;
  font-size: 1rem;
}

.card-content strong {
  color: #333;
  font-weight: 600;
}

.detail-btn {
  width: calc(100% - 36px);
  margin: 0 18px 18px;
  padding: 12px;
  background: linear-gradient(135deg, #0066cc, #004d99);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  background: linear-gradient(135deg, #004d99, #003366);
}

.no-scooters {
  text-align: center;
  width: 100%;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
  font-style: italic;
  background: #f9f9f9;
  border-radius: 12px;
  margin-top: 20px;
}
</style>
