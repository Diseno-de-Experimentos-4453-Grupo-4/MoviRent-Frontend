<template>
  <div class="publicar-scooter-view">
    <div class="header">
      <h1>Publica un Scooter</h1>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="scooter-form">
        <div class="form-group">
          <label>Marca:</label>
          <input v-model="form.Brand" placeholder="Ej: Xiaomi" required>
        </div>

        <div class="form-group">
          <label>Modelo:</label>
          <input v-model="form.Model" placeholder="Ej: Pro 2" required>
        </div>

        <div class="form-group">
          <label>Imagen (URL):</label>
          <input v-model="form.Image" placeholder="https://ejemplo.com/imagen.jpg">
        </div>

        <div class="form-group">
          <label>Precio por hora (S/):</label>
          <input v-model="form.Price" type="number" step="0.01" placeholder="1.50" required>
        </div>

        <div class="form-section">
          <h3>Ubicación</h3>

          <div class="form-group">
            <label>Calle:</label>
            <input v-model="form.Street" placeholder="Ej: Av. Los Olivos 123" required>
          </div>

          <div class="form-group">
            <label>Barrio/Urbanización:</label>
            <input v-model="form.Neighborhood" placeholder="Ej: Urb. Los Jardines" required>
          </div>

          <div class="form-group">
            <label>Ciudad:</label>
            <input v-model="form.City" placeholder="Ej: Lima" required>
          </div>

          <div class="form-group">
            <label>Distrito:</label>
            <input v-model="form.District" placeholder="Ej: San Isidro" required>
          </div>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import api from '@/api';

const router = useRouter();
const auth = getAuth();
const profileId = ref(null);
const profile = ref({});
const error = ref(null);


const form = ref({
  Brand: '',
  Image: '',
  Street: '',
  Neighborhood: '',
  City: '',
  District: '',
  Price: null,
  Model: '',
  ProfileId: null
});

onMounted(async () => {
  try {
    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;

      const response = await api.get(`Profile/${userEmail}`);
      if (response.data && response.data.id) {
        profileId.value = response.data.id;
        form.value.ProfileId = profileId.value;
      } else {
        error.value = "No se encontró información del perfil";
        alert('No se encontró un perfil para este usuario. Por favor, actualiza tu perfil primero.');
        router.push('/profile');
      }
    }
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
  }
});

const handleSubmit = async () => {
  try {

    if (!form.value.ProfileId && profileId.value) {
      form.value.ProfileId = profileId.value;
    }

    const scooterData = {
      brand: form.value.Brand,
      image: form.value.Image || '',
      street: form.value.Street,
      neighborhood: form.value.Neighborhood,
      city: form.value.City,
      district: form.value.District,
      price: parseFloat(form.value.Price).toFixed(2),
      model: form.value.Model,
      profileId: form.value.ProfileId
    };

    await api.post('/Scooter', scooterData);
    await router.push('/mis-scooters');
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

.form-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-top: 10px;
}

.form-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
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
</style>
