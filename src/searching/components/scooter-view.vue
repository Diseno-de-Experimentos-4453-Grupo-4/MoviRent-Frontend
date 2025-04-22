<script setup>
import { ref, onMounted } from 'vue'

const scooters = ref([])
const layout = ref('grid') // Definimos la variable layout como 'grid'
const loading = ref(false)

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    scooters.value = [
      { id: 1, image: 'https://picsum.photos/800/800' },
      { id: 2, image: 'https://picsum.photos/800/800' },
      { id: 3, image: 'https://picsum.photos/800/800' },
      { id: 4, image: 'https://picsum.photos/800/800' },
      { id: 5, image: 'https://picsum.photos/800/800' },
      { id: 6, image: 'https://picsum.photos/800/800' },
      { id: 7, image: 'https://picsum.photos/800/800' },
      { id: 8, image: 'https://picsum.photos/800/800' },
      { id: 9, image: 'https://picsum.photos/800/800' },
      { id: 10, image: 'https://picsum.photos/800/800' },
    ]
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="scooter-view">
    <DataView
      :value="scooters"
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
          <p>No hay scooters disponibles.</p>
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
