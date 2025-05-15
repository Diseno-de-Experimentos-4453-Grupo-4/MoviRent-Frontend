<template>
  <div class="completar-reserva-container">
    <h2 class="font-bold text-2xl mb-2">Completa tu reserva realizando el pago del alquiler</h2>
    <p class="mb-4">Sube la imagen del baucher de la transacción, el dueño se encargará de completar el proceso.</p>
    <div class="card flex bg-[#FFCC00] rounded-lg p-4 mb-4">
      <img :src="scooter?.image || 'https://picsum.photos/200/200'" class="w-32 h-32 object-cover rounded mr-4" />
      <div class="flex flex-col justify-center flex-1">
        <div class="font-bold text-lg mb-1">{{ scooter?.brand }} {{ scooter?.model }}</div>
        <div class="mb-1">Precio por hora: <span class="font-semibold">S/ {{ scooter?.price }}</span></div>
        <div class="mb-1">Horas a alquilar: <span class="font-semibold">{{ hours }}</span></div>
        <div class="mb-1">Persona interesada: <span class="font-semibold">{{ profile?.firstName }} {{ profile?.lastName }}</span></div>
        <div class="mb-1">Dueño del scooter: <span class="font-semibold">{{ owner?.firstName }} {{ owner?.lastName }}</span></div>
        <div class="mb-1">Fecha de solicitud: <span class="font-semibold">{{ fechaSolicitud }}</span></div>
      </div>
    </div>
    <div class="mb-2">
      <span class="font-bold">Cuenta bancaria asociada al scooter:</span>
      <span class="ml-2">{{ scooter?.bankAccount }}</span>
    </div>
    <div class="mt-6 mb-2 font-bold">Imagen del baucher de la transacción</div>
    <div class="flex flex-col items-center mb-4">
      <input type="file" accept="image/*" @change="onFileChange" class="mb-2" />
      <span class="mb-2">o</span>
      <input type="text" v-model="baucherUrl" placeholder="Pega el enlace de la imagen" class="input-link mb-2" />
      <div v-if="baucherPreview" class="preview-container mb-2">
        <img :src="baucherPreview" alt="Previsualización baucher" class="h-full w-full object-contain border-none rounded" />
      </div>
    </div>
    <div class="flex gap-4 justify-center pt-5">
      <button class="btn-primary" @click="solicitarReserva" :disabled="loading">
        {{ loading ? 'Solicitando...' : 'Solicitar reserva' }}
      </button>
      <button class="btn-secondary" @click="$emit('back')" :disabled="loading">Volver atrás</button>
    </div>
    <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
    <div v-if="success" class="text-green-600 mt-2">Reserva solicitada correctamente.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/api'
import { useProfileStore } from '@/stores/profileStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  scooterId: Number,
  hours: Number
})

const scooter = ref(null)
const owner = ref(null)
const profile = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const baucherFile = ref(null)
const baucherUrl = ref('')
const baucherPreview = ref('')
const fechaSolicitud = computed(() => {
  const now = new Date()
  return now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
})

const vueRouter = useRouter()

const profileStore = useProfileStore()

onMounted(async () => {
  profile.value = profileStore.getProfile()
  const user = await api.get(`/Profile/${profile.value.email}`)
  profile.value = {
    ...user.data,
    firstName: user.data.name?.firstName || user.data.fullName?.split(' ')[0] || '',
    lastName: user.data.name?.lastName || user.data.fullName?.split(' ')[1] || ''
  }
  const scooterRes = await api.get(`/Scooter/${props.scooterId}`)
  scooter.value = scooterRes.data
  const ownerRes = await api.get(`/Profile/${scooter.value.profileId}`)
  owner.value = {
    ...ownerRes.data,
    firstName: ownerRes.data.name?.firstName || ownerRes.data.fullName?.split(' ')[0] || '',
    lastName: ownerRes.data.name?.lastName || ownerRes.data.fullName?.split(' ')[1] || ''
  }
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    baucherFile.value = file
    baucherUrl.value = ''
    const reader = new FileReader()
    reader.onload = (ev) => {
      baucherPreview.value = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

watch(() => baucherUrl.value, (val) => {
  if (val) {
    baucherPreview.value = val
    baucherFile.value = null
  }
})

async function solicitarReserva() {
  error.value = ''
  success.value = false
  if (!baucherFile.value && !baucherUrl.value) {
    error.value = 'Debes subir una imagen o enlace del baucher.'
    return
  }
  loading.value = true
  try {
    let baucherImgUrl = baucherUrl.value
    if (baucherFile.value) {
      baucherImgUrl = baucherPreview.value
    }
    await api.post('/Booking', {
      ProfileId: profile.value.id,
      ScooterId: scooter.value.id,
      StartDate: new Date().toISOString(),
      EndDate: new Date(Date.now() + props.hours * 60 * 60 * 1000).toISOString(),
      Baucher: baucherImgUrl,
      StatusId: 2
    })
    success.value = true
  } catch (error) {
    error.value = 'Error al solicitar la reserva.'
  } finally {
    loading.value = false
    vueRouter.push('/historial')
  }
}
</script>

<style scoped>
.completar-reserva-container {
  width: 75%;
  margin: 2rem auto;
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.card {
  min-height: 140px;
  gap: 24px !important;
}
.input-link {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bbb;
  border-radius: 4px;
}
.btn-primary {
  background: #FFCC00;
  color: #222;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  width: 366px;
}
.btn-secondary {
  background: #eee;
  color: #333;
  padding: 0.5rem 1.5rem;
  margin-top: 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  width: 366px;
}

.preview-container{
  margin-top: 1.5rem;
}
.btn-primary:disabled, .btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
