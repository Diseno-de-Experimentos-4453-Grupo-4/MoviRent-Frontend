<template>
  <div class="subscription-view">
    <h1>Suscripción</h1>
    <p class="intro-text">Disfruta de acceso ilimitado a nuestros scooters premium durante un mes completo.</p>

    <div class="plans-container">
      <div class="plan-card highlight">
        <h3>Plan Mensual Premium</h3>
        <p>Acceso 7 días a la semana las 24 horas + scooters de última generación</p>
        <p class="price">S/ 60</p>
        <button @click="selectPlan('monthly-premium')" class="subscribe-btn">Suscríbete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import api from '@/api';
import { useProfileStore } from '@/stores/profileStore.js'

const router = useRouter();
const auth = getAuth();
const profileStore = useProfileStore();
const selectPlan = async (planType) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }

    const profile = profileStore.getProfile();


    const response = await api.post('/Subscription', {
      profileId: profile.id,
    });

    console.log('Suscripción exitosa:', response.data);
    alert('¡Suscripción premium activada con éxito!');

  } catch (error) {
    console.error('Error al suscribirse:', error);
    alert('Error al procesar la suscripción. Intenta nuevamente.');
  }
};
</script>

<style scoped>
.subscription-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.intro-text {
  text-align: center;
  margin-bottom: 40px;
  color: #555;
  font-size: 1.1rem;
}

.plans-container {
  display: flex;
  justify-content: center; /* Centra el único plan */
  margin-bottom: 50px;
}

.plan-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  width: 100%;
  max-width: 400px;
}

.plan-card.highlight {
  border: 2px solid #0066cc;
  background: #f8faff;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #0066cc;
  margin: 20px 0;
  text-align: center;
}

.subscribe-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #0066cc, #004d99);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
  margin-top: 10px;
}

.subscribe-btn:hover {
  background: linear-gradient(135deg, #004d99, #003366);
  transform: translateY(-2px);
}
</style>
