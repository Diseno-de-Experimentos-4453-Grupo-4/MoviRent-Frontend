<template>
  <div class="edit-profile-container">
    <h1>Editar Perfil</h1>

    <div v-if="loading" class="loading">
      Cargando datos del perfil...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <form v-else @submit.prevent="updateProfile">
      <div class="form-section">
        <h3>Datos personales</h3>
        <div class="input-group">
          <label>Nombre</label>
          <input type="text" placeholder="Ingresa tu nombre" v-model="profile.firstName" required>
        </div>
        <div class="input-group">
          <label>Apellido</label>
          <input type="text" placeholder="Ingresa tu apellido" v-model="profile.lastName" required>
        </div>
        <div class="input-group">
          <label>Correo</label>
          <input type="email" placeholder="Ingresa tu correo" v-model="profile.email" required>
        </div>
        <div class="input-group">
          <label>DNI</label>
          <input type="text" placeholder="Ingresa tu DNI" v-model="profile.dni" required>
        </div>
        <div class="input-group">
          <label>Edad</label>
          <input type="number" placeholder="Ingresa tu edad" v-model="profile.age" required>
        </div>
        <div class="input-group">
          <label>Teléfono</label>
          <input type="tel" placeholder="Ingresa tu número de teléfono" v-model="profile.phone" required>
        </div>
      </div>

      <div class="form-section">
        <h3>Dirección</h3>
        <div class="input-group">
          <label>Calle</label>
          <input type="text" placeholder="Ingresa tu calle" v-model="profile.street">
        </div>
        <div class="input-group">
          <label>Barrio/Urbanización</label>
          <input type="text" placeholder="Ingresa tu barrio" v-model="profile.neighborhood">
        </div>
        <div class="input-group">
          <label>Ciudad</label>
          <input type="text" placeholder="Ingresa tu ciudad" v-model="profile.city">
        </div>
        <div class="input-group">
          <label>Distrito</label>
          <input type="text" placeholder="Ingresa tu distrito" v-model="profile.district">
        </div>
      </div>

      <div class="form-section">
        <button class="save-button" type="submit">Guardar Cambios</button>
        <button class="cancel-button" type="button" @click="$router.push('/')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';

const route = useRoute();
const router = useRouter();
const profile = ref({});
const loading = ref(true);
const error = ref(null);

const fetchProfile = async () => {
  try {
    const profileId = route.params.profileId;
    const response = await api.get(`Profile/${profileId}`);
    profile.value = response.data;
  } catch (err) {
    console.error("Error al cargar el perfil:", err);
    error.value = "Error al cargar el perfil: " + err.message;
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  try {
    const profileId = route.params.profileId;
    await api.put(`Profile/${profileId}`, profile.value);
    alert("Perfil actualizado con éxito");
    router.push('/');
  } catch (err) {
    console.error("Error al actualizar el perfil:", err);
    error.value = "Error al actualizar el perfil: " + err.message;
  }
};

onMounted(fetchProfile);
</script>

<style scoped>
.edit-profile-container {
  width: 50%;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
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

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #0066cc;
  font-size: 1.2rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.save-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.cancel-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.save-button:hover {
  background-color: #218838;
}
</style>
