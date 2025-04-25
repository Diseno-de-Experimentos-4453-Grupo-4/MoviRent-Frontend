<template>
  <div class="profile-container">
    <h1>¿Tus datos son incorrectos o deseas actualizarlos? ¡Edítalos!</h1>

    <div v-if="loading" class="loading">
      Cargando datos del perfil...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="profile-data">
      <h2>Datos personales</h2>
      <div class="data-row">
        <span class="data-label">Nombre:</span>
        <span class="data-value">{{ profile.firstName || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Apellido:</span>
        <span class="data-value">{{ profile.lastName || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Correo:</span>
        <span class="data-value">{{ profile.email }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">DNI:</span>
        <span class="data-value">{{ profile.dni || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Edad:</span>
        <span class="data-value">{{ profile.age || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Teléfono:</span>
        <span class="data-value">{{ profile.phone || 'No especificado' }}</span>
      </div>

      <h2>Dirección</h2>
      <div class="data-row">
        <span class="data-label">Calle:</span>
        <span class="data-value">{{ profile.street || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Barrio:</span>
        <span class="data-value">{{ profile.neighborhood || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Ciudad:</span>
        <span class="data-value">{{ profile.city || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Distrito:</span>
        <span class="data-value">{{ profile.district || 'No especificado' }}</span>
      </div>
    </div>

    <button class="history-button" @click="goToHistory">Ver Historial</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import auth from '@/auth';
import api from '@/api';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/profileStore.js'

const profile = ref({});
const loading = ref(true);
const error = ref(null);
const router = useRouter();
const profileStore = useProfileStore();

const goToHistory = () => {
  router.push('/historial');
};
onMounted(async () => {
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;

      const response = await api.get(`Profile/${userEmail}`);
      if (response.data && response.data.id) {
        profile.value = {
          ...response.data,
          firstName: response.data.name?.firstName || response.data.fullName?.split(' ')[0] || '',
          lastName: response.data.name?.lastName || response.data.fullName?.split(' ')[1] || '',
          street: response.data.address?.street || response.data.fullAddress.split(',')[0] || '',
          neighborhood: response.data.address?.neighborhood || response.data.fullAddress.split(',')[1] || '',
          city: response.data.address?.city || response.data.fullAddress.split(',')[2] || '',
          district: response.data.address?.district || response.data.fullAddress.split(',')[3] || '',
        };
      } else {
        error.value = "No se encontró información del perfil";
      }
      profileStore.setProfile(profile.value);


    } else {
      error.value = "Usuario no autenticado";
    }
  } catch (err) {
    console.error("Error al obtener datos del perfil:", err);
    error.value = "Error al cargar el perfil: " + err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
}

.loading, .error-message {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
}

.error-message {
  color: #d9534f;
}

.profile-data {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.profile-data h2 {
  color: #0066cc;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.profile-data h2:first-child {
  margin-top: 0;
}

.data-row {
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}
.data-label {
  font-weight: bold;
  width: 150px;
  color: #555;
}
.data-value {
  flex: 1;
}
.history-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.history-button:hover {
  background-color: #004d99;
}
</style>
