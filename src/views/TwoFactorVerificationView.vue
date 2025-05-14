<script setup lang="ts">

</script>

<template>
  <div class="verification-container">
    <h1>Verificación de correo electrónico</h1>
    <p>Se ha enviado un correo de verificación a tu dirección de correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.</p>
    <p>Una vez que hayas verificado tu correo, podrás iniciar sesión.</p>
    <router-link to="/login" class="login-link">Volver al inicio de sesión</router-link>
  </div>
</template>

<style scoped>
.verification-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
  font-family: Arial, sans-serif;
}
h1 {
  color: #333;
  margin-bottom: 1rem;
}
p {
  color: #555;
  margin-bottom: 1rem;
}
.login-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
.login-link:hover {
  background-color: #004d99;
}
</style>
