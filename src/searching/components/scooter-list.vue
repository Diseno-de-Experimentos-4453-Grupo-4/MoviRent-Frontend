<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      district: null,
      address: ''
    })
  }
})

const scooters = ref([])
const layout = ref('grid')
const loading = ref(false)

const loadScooters = () => {
  loading.value = true
  setTimeout(() => {
    scooters.value = [
      { id: 1, image: 'https://picsum.photos/800/800', district: 'Distrito 1', address: 'Av. Principal 123' },
      { id: 2, image: 'https://picsum.photos/800/800', district: 'Distrito 2', address: 'Calle Los Olivos 456' },
      { id: 3, image: 'https://picsum.photos/800/800', district: 'Distrito 3', address: 'Jr. Las Flores 789' },
      { id: 4, image: 'https://picsum.photos/800/800', district: 'Distrito 1', address: 'Av. Central 234' },
      { id: 5, image: 'https://picsum.photos/800/800', district: 'Distrito 2', address: 'Calle Los Pinos 567' },
      { id: 6, image: 'https://picsum.photos/800/800', district: 'Distrito 3', address: 'Jr. Las Palmeras 890' },
      { id: 7, image: 'https://picsum.photos/800/800', district: 'Distrito 1', address: 'Av. Libertadores 345' },
      { id: 8, image: 'https://picsum.photos/800/800', district: 'Distrito 2', address: 'Calle Los Cedros 678' },
      { id: 9, image: 'https://picsum.photos/800/800', district: 'Distrito 3', address: 'Jr. Las Orquídeas 901' },
      { id: 10, image: 'https://picsum.photos/800/800', district: 'Distrito 1', address: 'Av. Industrial 456' },
      { id: 11, image: 'https://picsum.photos/800/800', district: 'Distrito 2', address: 'Calle Los Nogales 789' },
      { id: 12, image: 'https://picsum.photos/800/800', district: 'Distrito 3', address: 'Jr. Las Violetas 012' },
      { id: 13, image: 'https://picsum.photos/800/800', district: 'Distrito 1', address: 'Av. Comercial 567' },
      { id: 14, image: 'https://picsum.photos/800/800', district: 'Distrito 2', address: 'Calle Los Robles 890' },
      { id: 15, image: 'https://picsum.photos/800/800', district: 'Distrito 3', address: 'Jr. Las Azucenas 123' }
    ]
    loading.value = false
  }, 500)
}

const filteredScooters = computed(() => {
  if (!props.filters.district && !props.filters.address) {
    return scooters.value
  }

  return scooters.value.filter(scooter => {
    let matchesDistrict = true
    let matchesAddress = true

    if (props.filters.district) {
      matchesDistrict = scooter.district === props.filters.district.name
    }

    if (props.filters.address && props.filters.address.trim() !== '') {
      matchesAddress = scooter.address.toLowerCase().includes(props.filters.address.toLowerCase())
    }

    return matchesDistrict && matchesAddress
  })
})

watch(() => props.filters, () => {
}, { deep: true })

onMounted(() => {
  loadScooters()
})
</script>

<template>
  <div class="scooter-view">
    <DataView
      :value="filteredScooters"
      :layout="layout"
      :paginator="true"
      :rows="9"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      class="p-4"
    >
      <template #grid="slotProps">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div v-for="scooter in slotProps.items" :key="scooter.id" class="card">
            <div class="card-content items-center">
              <img :src="scooter.image" alt="Scooter Image" class="w-70 h-120 object-cover" />
              <div class="p-4 flex justify-center max-w-70 w-full">
                <Button
                  label="Ver detalles"
                  class="p-button-primary"
                  @click="$router.push(`/scooter/${scooter.id}`)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex justify-center p-6">
          <p>No hay scooters disponibles con los filtros seleccionados.</p>
        </div>
      </template>
    </DataView>
  </div>
</template>

<style scoped>

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: none;
}

.p-button-primary {
  width: 100%;
  margin-top: auto;
  background-color: greenyellow;
  border: none;
  color: black;
}

.card-content {
  border: none;
}
</style>
