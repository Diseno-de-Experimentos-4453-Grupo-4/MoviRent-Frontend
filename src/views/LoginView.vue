<template>
  <div class="login-container">
    <h1>Iniciar sesión</h1>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="verificationMessage" class="verification-message">{{ verificationMessage }}</p>
    <div class="input-group">
      <label>Correo</label>
      <input type="email" placeholder="ingresa tu correo" v-model="email">
    </div>
    <div class="input-group">
      <label>Contraseña</label>
      <input type="password" placeholder="ingresa tu contraseña" v-model="password">
    </div>
    <button class="login-button" @click="handleLogin">Iniciar Sesión</button>
    <p class="forgot-password">
      <a @click="handlePasswordReset">¿Olvidaste tu contraseña?</a>
    </p>
    <p class="register-prompt">
      ¿Aún no tienes una cuenta? <router-link to="/register">Regístrate</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import auth from '@/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const verificationMessage = ref('');

const handleLogin = async () => {
  error.value = '';
  verificationMessage.value = '';
  try {
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    if (err.message.includes('verifica tu correo electrónico')) {
      verificationMessage.value = err.message;
    } else {
      error.value = err.message;
    }
  }
};

const handlePasswordReset = async () => {
  if (!email.value.trim()) {
    error.value = 'Por favor, ingresa tu correo para restablecer la contraseña.';
    return;
  }

  try {
    const response = await auth.resetPassword(email.value);
    verificationMessage.value = response.message;
  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}
.error-message {
  color: red;
  text-align: center;
  margin-bottom: 1rem;
}
.verification-message {
  color: orange;
  text-align: center;
  margin-bottom: 1rem;
}
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
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
.login-button {
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
.forgot-password {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}
.forgot-password a {
  color: #0066cc;
  text-decoration: none;
  cursor: pointer;
}
.register-prompt {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}
.register-prompt a {
  color: #0066cc;
  text-decoration: none;
}
</style>
