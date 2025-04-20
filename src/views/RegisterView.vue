<template>
  <div class="register-container">
    <h1>Regístrate y sé parte de esta gran comunidad</h1>
    <p v-if="error" class="error-message">{{ error }}</p>
    <div class="input-group">
      <label>Nombre completo</label>
      <input type="text" placeholder="Ingresa tu nombre" v-model="userData.name">
    </div>
    <div class="input-group">
      <label>Contraseña</label>
      <input type="password" placeholder="Ingresa tu contraseña" v-model="userData.password">
    </div>
    <div class="input-group">
      <label>Teléfono</label>
      <input type="tel" placeholder="Ingresa tu número de teléfono" v-model="userData.phone">
    </div>
    <div class="input-group">
      <label>Correo</label>
      <input type="email" placeholder="Ingresa tu correo" v-model="userData.email">
    </div>
    <div class="input-group">
      <label>DNI</label>
      <input type="text" placeholder="Ingresa tu DNI" v-model="userData.dni">
    </div>
    <button class="register-button" @click="handleRegister">Registrarse</button>
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
const userData = ref({
  name: '',
  password: '',
  phone: '',
  email: '',
  dni: ''
});

const handleRegister = async () => {
  try {
    await auth.register(userData.value);
    router.push('/');
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 500px;
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
