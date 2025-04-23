<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import api from '@/api';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      district: null,
      address: ''
    })
  }
});

const scooters = ref([]);
const layout = ref('grid');
const loading = ref(false);
const initialized = ref(false);

const hasActiveFilters = computed(() => {
  return (props.filters.district !== null) ||
         (props.filters.address && props.filters.address.trim() !== '');
});

const fetchScooters = async () => {
  if (!hasActiveFilters.value) {
    scooters.value = [];
    return;
  }

  loading.value = true;
  try {
    let response;

    if (props.filters.district) {
      response = await api.get(`/api/v1/Scooter/district?district=${encodeURIComponent(props.filters.district.name)}`);
    } else if (props.filters.address && props.filters.address.trim() !== '') {
      response = await api.get(`/api/v1/Scooter/address/${encodeURIComponent(props.filters.address)}`);
    } else {
      return;
    }

    scooters.value = response.data;
    initialized.value = true;
  } catch (error) {
    console.error('Error al cargar los scooters:', error);
    scooters.value = [];
  } finally {
    loading.value = false;
  }
};

watch(() => props.filters, () => {
  fetchScooters();
}, { deep: true });

onMounted(() => {
  initialized.value = false;
});
</script>

<template>
  <div class="scooter-view">
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      <div v-for="n in 9" :key="n" class="card">
        <div class="card-content items-center">
          <Skeleton height="300px" width="100%" />
          <div class="p-4 flex justify-center max-w-70 w-full">
            <Skeleton height="40px" width="100%" class="mt-2" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!hasActiveFilters" class="filter-required-message">
      <div class="flex flex-col items-center justify-center p-8 text-center">
        <i class="pi pi-filter text-5xl mb-4 text-gray-400"></i>
        <h2 class="text-2xl font-bold mb-2">Selecciona un filtro para comenzar</h2>
        <p class="text-gray-600">Utiliza el panel de filtros para buscar scooters por distrito o dirección</p>
      </div>
    </div>

    <DataView
      v-else
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
              <img :src="scooter.image || 'https://picsum.photos/800/800'" alt="Scooter Image" class="w-70 h-120 object-cover" />
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

.filter-required-message {
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 2rem;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
