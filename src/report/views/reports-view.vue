<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';

const route = useRoute();
const router = useRouter();
const scooterId = ref(Number(route.params.scooterId));
const reports = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const description = ref('');
const submitting = ref(false);
const success = ref(false);
const profile = ref(null);
const canReport = ref(false);

const fetchReports = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/report/scooter?scooterId=${scooterId.value}`);
    reports.value = response.data || [];
  } catch (err) {
    error.value = 'No se pudieron cargar los reportes.';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchReports();
  // Obtener el perfil del usuario autenticado
  try {
    const auth = await import('firebase/auth');
    const { getAuth } = auth;
    const firebaseAuth = getAuth();
    if (firebaseAuth.currentUser) {
      const userEmail = firebaseAuth.currentUser.email;
      const response = await api.get(`/Profile/${userEmail}`);
      profile.value = response.data;
      // Verificar si el usuario ha alquilado este scooter
      const bookingsRes = await api.get(`/Booking?profileId=${profile.value.id}`);
      canReport.value = Array.isArray(bookingsRes.data) && bookingsRes.data.some(b => b.scooterId === scooterId.value);
    }
  } catch (err) {
    profile.value = null;
    canReport.value = false;
  }
});

const openModal = () => {
  description.value = '';
  showModal.value = true;
  success.value = false;
};

const closeModal = () => {
  showModal.value = false;
  description.value = '';
  success.value = false;
};

const submitReport = async () => {
  if (!description.value.trim()) {
    error.value = 'La descripción es obligatoria.';
    return;
  }
  if (!profile.value) {
    error.value = 'No se pudo obtener el perfil del usuario.';
    return;
  }
  submitting.value = true;
  error.value = null;
  try {
    await api.post('/report', {
      profileId: profile.value.id,
      scooterId: scooterId.value,
      content: description.value
    });
    success.value = true;
    await fetchReports();
    closeModal();
  } catch (err) {
    error.value = 'No se pudo enviar el reporte.';
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="reports-view min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="container mx-auto p-4 flex flex-col items-center justify-center h-full gap-4">
      <h2 class="text-2xl font-bold mb-6">Reportes de incidentes</h2>
      <div class="mb-4 flex gap-4">
        <Button v-if="canReport" label="Nuevo reporte" icon="pi pi-plus" severity="danger" @click="openModal" />
        <Button label="Regresar" icon="pi pi-arrow-left" @click="goBack" />
      </div>
      <div v-if="loading" class="loading-container">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p>Cargando reportes...</p>
      </div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="reports.length === 0" class="no-reports-message text-center">No hay reportes para este scooter.</div>
      <div v-else class="reports-list grid grid-cols-1  gap-4">
        <Card v-for="report in reports" :key="report.id" class="mb-3 report-card-wide">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold">Reporte #{{ report.id }}</span>
            </div>
          </template>
          <template #content>
            <div>{{ report.content }}</div>
          </template>
        </Card>
      </div>
      <Dialog v-model:visible="showModal" header="Nuevo Reporte" :modal="true" :closable="true" :style="{ width: '400px' }">
        <div class="mb-4">
          <label class="block mb-2 font-bold">Descripción del incidente</label>
          <Textarea v-model="description" rows="4" class="w-full" placeholder="Describe el incidente..." />
        </div>
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" severity="secondary" @click="closeModal" :disabled="submitting" />
          <Button label="Enviar" severity="danger" @click="submitReport" :loading="submitting" :disabled="submitting" />
        </div>
        <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
        <div v-if="success" class="text-green-600 mt-2">Reporte enviado correctamente.</div>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
.reports-view {
  min-height: 90vh;
}
.loading-container,
.error-message,
.no-reports-message {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
}
.reports-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.report-card-wide {
  width: 100%;
  max-width: 100%;
  min-width: 600px;
  box-sizing: border-box;
}
</style>
