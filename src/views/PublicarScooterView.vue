<template>
  <div class="publicar-scooter-view">
    <div class="header">
      <h1>Publica un Scooter</h1>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="scooter-form">
        <div class="form-group">
          <label>Nombre:</label>
          <input v-model="form.nombre" placeholder="Ej: Scooter 2" required>
        </div>

        <div class="form-group">
          <label>Marca:</label>
          <input v-model="form.marca" placeholder="Ej: Genérica" required>
        </div>

        <div class="form-group">
          <label>Modelo:</label>
          <input v-model="form.modelo" placeholder="Ej: Modelo 123" required>
        </div>

        <div class="form-group">
          <label>Precio por hora (S/):</label>
          <input v-model="form.precio" type="number" step="0.01" placeholder="1.50" required>
        </div>

        <div class="form-group">
          <label>Dirección:</label>
          <input v-model="form.direccion" placeholder="Ej: Los Olivos 123" required>
        </div>

        <div class="form-group">
          <label>Contacto:</label>
          <input v-model="form.contacto" placeholder="Ej: 999-999-999" required>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">Crear</button>
          <button type="button" @click="cancelar" class="cancel-btn">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import api from '@/api';

const router = useRouter();
const auth = getAuth();

const form = ref({
  nombre: '',
  marca: '',
  modelo: '',
  precio: null,
  direccion: '',
  contacto: '',
  propietario: auth.currentUser?.email || ''
});

const handleSubmit = async () => {
  try {
    await api.post('/scooters', form.value);
    router.push('/mis-scooters');
  } catch (error) {
    console.error('Error al publicar scooter:', error);
    alert('Ocurrió un error al publicar tu scooter');
  }
};

const cancelar = () => {
  router.push('/mis-scooters');
};
</script>

<style scoped>
.publicar-scooter-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.scooter-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.form-group input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #0066cc;
  outline: none;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.submit-btn, .cancel-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.submit-btn {
  background: linear-gradient(135deg, #0066cc, #004d99);
  color: white;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #004d99, #003366);
  transform: translateY(-2px);
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.links-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.links-section h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.links-section a {
  color: #555;
  text-decoration: none;
  transition: color 0.3s;
}

.links-section a:hover {
  color: #0066cc;
}
</style>
