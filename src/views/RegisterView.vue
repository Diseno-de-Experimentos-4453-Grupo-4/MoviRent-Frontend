<template>
  <div class="register-container">
    <h1>Regístrate y sé parte de esta gran comunidad</h1>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div class="form-section">
      <h3>Datos de cuenta</h3>
      <div class="input-group">
        <label>Correo</label>
        <input type="email" placeholder="Ingresa tu correo" v-model="userData.email" required>
      </div>
      <div class="input-group">
        <label>Contraseña</label>
        <input type="password" placeholder="Ingresa tu contraseña" v-model="userData.password" required>
      </div>
    </div>

    <div class="form-section">
      <h3>Datos personales</h3>
      <div class="input-group">
        <label>Nombre</label>
        <input type="text" placeholder="Ingresa tu nombre" v-model="userData.firstName" required>
      </div>
      <div class="input-group">
        <label>Apellido</label>
        <input type="text" placeholder="Ingresa tu apellido" v-model="userData.lastName" required>
      </div>
      <div class="input-group">
        <label>DNI</label>
        <input type="text" placeholder="Ingresa tu DNI" v-model="userData.dni" required>
      </div>
      <div class="input-group">
        <label>Edad</label>
        <input type="number" placeholder="Ingresa tu edad" v-model="userData.age" required>
      </div>
      <div class="input-group">
        <label>Teléfono</label>
        <input type="tel" placeholder="Ingresa tu número de teléfono" v-model="userData.phone" required>
      </div>
    </div>

    <div class="form-section">
      <h3>Dirección</h3>
      <div class="input-group">
        <label>Calle</label>
        <input type="text" placeholder="Ingresa tu calle" v-model="userData.street">
      </div>
      <div class="input-group">
        <label>Barrio/Urbanización</label>
        <input type="text" placeholder="Ingresa tu barrio" v-model="userData.neighborhood">
      </div>
      <div class="input-group">
        <label>Ciudad</label>
        <input type="text" placeholder="Ingresa tu ciudad" v-model="userData.city">
      </div>
      <div class="input-group">
        <label>Distrito</label>
        <input type="text" placeholder="Ingresa tu distrito" v-model="userData.district">
      </div>
    </div>

    <button class="register-button" @click="handleRegister" :disabled="isRegistering">
      {{ isRegistering ? 'Registrando...' : 'Registrarse' }}
    </button>
    <p class="login-prompt">
      ¿Ya tienes una cuenta? <router-link to="/login">Inicia Sesión</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import auth from '@/auth';

const router = useRouter();
const error = ref('');
const isRegistering = ref(false);
const userData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  dni: '',
  age: null,
  phone: '',
  street: '',
  neighborhood: '',
  city: '',
  district: ''
});

const validateForm = () => {
  if (!userData.value.firstName.trim() || !userData.value.lastName.trim()) {
    error.value = 'El nombre y apellido son obligatorios';
    return false;
  }

  if (!userData.value.email.trim()) {
    error.value = 'El correo electrónico es obligatorio';
    return false;
  }

  if (!userData.value.password.trim() || userData.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres';
    return false;
  }

  if (!userData.value.dni.trim()) {
    error.value = 'El DNI es obligatorio';
    return false;
  }

  if (!userData.value.age || userData.value.age < 18) {
    error.value = 'Debes tener al menos 18 años';
    return false;
  }

  if (!userData.value.phone.trim()) {
    error.value = 'El teléfono es obligatorio';
    return false;
  }

  return true;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  error.value = '';
  isRegistering.value = true;

  try {
    await auth.register(userData.value);
    await router.push('/two-factor-verification');
  } catch (err) {
    error.value = err.message;
  } finally {
    isRegistering.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}
.error-message {
  color: red;
  text-align: center;
  margin-bottom: 1rem;
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
.register-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}
.register-button:disabled {
  background-color: #7db1e8;
  cursor: not-allowed;
}
.login-prompt {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}
.login-prompt a {
  color: #0066cc;
  text-decoration: none;
}
</style>
