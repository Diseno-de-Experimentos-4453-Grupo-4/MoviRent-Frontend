<template>
  <CompletarReserva
    :scooter-id="scooterId"
    :hours="hours"
    @back="goBack"
  />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import CompletarReserva from '../components/CompletarReserva.vue'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const scooterId = ref(parseInt(route.params.scooterId))
const hours = ref(parseInt(route.query.hours || 1))

const goBack = () => {
  router.back()
}
</script>
