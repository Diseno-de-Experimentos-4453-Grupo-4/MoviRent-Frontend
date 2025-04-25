<template>
  <div class="subscription-view">
    <h1>Suscripción</h1>
    <p class="intro-text">En MoviRent contamos con tres planes de suscripción que te brindarán beneficios únicos.</p>

    <div class="plans-container">
      <div class="plan-card">
        <h3>Plan Mensual</h3>
        <p>Acceso 7 días de la semana con scooters 100% garantizados.</p>
        <p class="price">S/ 39</p>
        <button @click="selectPlan('monthly')" class="subscribe-btn">Suscríbete</button>
      </div>

      <div class="plan-card highlight">
        <h3>Plan Trimestral</h3>
        <p>Incluye acceso a scooters deportivos + beneficios exclusivos.</p>
        <p class="price">S/ 99</p>
        <button @click="selectPlan('quarterly')" class="subscribe-btn">Suscríbete</button>
      </div>

      <div class="plan-card">
        <h3>Plan Anual</h3>
        <p>Todos los beneficios durante 1 año + priority access.</p>
        <p class="price">S/ 199</p>
        <button @click="selectPlan('annual')" class="subscribe-btn">Suscríbete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import api from '@/api';

const router = useRouter();
const auth = getAuth();

const selectPlan = async (planType) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }

    const response = await api.post('/api/subscriptions', {
      userId: user.uid,
      plan: planType,
      email: user.email
    });

    console.log('Suscripción exitosa:', response.data);
    alert('¡Suscripción activada con éxito!');

  } catch (error) {
    console.error('Error al suscribirse:', error);
    alert('Error al procesar la suscripción. Intenta nuevamente.');
  }
};
</script>

<style scoped>
.subscription-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.intro-text {
  text-align: center;
  margin-bottom: 40px;
  color: #555;
}

.plans-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.plan-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-card.highlight {
  border: 2px solid #0066cc;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0066cc;
  margin: 15px 0;
}

.subscribe-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #0066cc, #004d99);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.subscribe-btn:hover {
  background: linear-gradient(135deg, #004d99, #003366);
}

.footer-links {
  display: flex;
  justify-content: space-around;
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.links-section {
  text-align: center;
}

.links-section h4 {
  color: #333;
  margin-bottom: 10px;
}
</style>
