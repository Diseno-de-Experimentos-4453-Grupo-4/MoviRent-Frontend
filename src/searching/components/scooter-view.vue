<script setup>
import { ref, onMounted } from 'vue';

const scooters = ref([]);
const layout = ref('grid'); // Definimos la variable layout como 'grid'
const loading = ref(false);

onMounted(() => {
  loading.value = true;
  setTimeout(() => {
    scooters.value = [
      { id: 1, image: 'https://picsum.photos/500/500' },
      { id: 2, image: 'https://picsum.photos/500/500' },
      { id: 3, image: 'https://picsum.photos/500/500' },
      { id: 4, image: 'https://picsum.photos/500/500' },
      { id: 5, image: 'https://picsum.photos/500/500' },
      { id: 6, image: 'https://picsum.photos/500/500' },
      { id: 7, image: 'https://picsum.photos/500/500' },
      { id: 8, image: 'https://picsum.photos/500/500' },
      { id: 9, image: 'https://picsum.photos/500/500' },
      { id: 10, image: 'https://picsum.photos/500/500' },
    ];
    loading.value = false;
  }, 500);
});

</script>

<template>
  <div class="scooter-view">
    <DataView
      :value="scooters"
      :layout="layout"
      :paginator="true"
      :rows="3"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      class="p-4">
      <template #grid="slotProps">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="scooter in slotProps.items" :key="scooter.id" class="card">
            <div class="card-content items-center">
              <img :src="scooter.image" alt="Scooter Image" class="w-40 h-70 object-cover " />
              <div class="p-4 flex justify-center">
                <Button label="Ver detalles" class="p-button-primary" @click="$router.push(`/scooter/${scooter.id}`)" />
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
      <template #loading>
        <div class="flex justify-center p-6">
          <ProgressSpinner />
        </div>
      </template>
    </DataView>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.p-button-primary {
  width: 100%;
  margin-top: auto;
}
</style>
