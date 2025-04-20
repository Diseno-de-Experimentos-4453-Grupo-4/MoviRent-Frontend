<template>
  <div class="profile-container">
    <h1>¿Tus datos son incorrectos o deseas actualizarlos? ¡Edítalos!</h1>
    <div class="profile-data">
      <div class="data-row">
        <span class="data-label">Nombre completo:</span>
        <span class="data-value">{{ user.name || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Contraseña:</span>
        <span class="data-value">••••••••</span>
      </div>
      <div class="data-row">
        <span class="data-label">Teléfono:</span>
        <span class="data-value">{{ user.phone || 'No especificado' }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Correo:</span>
        <span class="data-value">{{ user.email }}</span>
      </div>
      <div class="data-row">
        <span class="data-label">DNI:</span>
        <span class="data-value">{{ user.dni || 'No especificado' }}</span>
      </div>
    </div>
    <button class="history-button">Ver Historial</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import auth from '@/auth';

const user = ref({});

onMounted(() => {
  user.value = auth.getCurrentUser() || {};
});
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}
.profile-data {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
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
</style>
