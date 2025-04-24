import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScooterStore = defineStore('scooter', () => {
  const scooters = ref([])
  const selectedScooter = ref(null)

  function setScooters(scootersList) {
    scooters.value = scootersList
  }

  function addScooter(scooter) {
    scooters.value.push(scooter)
  }

  function getScooterById(id) {
    const numericId = parseInt(id, 10);
    return scooters.value.find(s => s.id === numericId);
  }

  function setSelectedScooter(scooter) {
    selectedScooter.value = scooter
  }

  return {
    scooters,
    selectedScooter,
    setScooters,
    getScooterById,
    setSelectedScooter
  }
})
