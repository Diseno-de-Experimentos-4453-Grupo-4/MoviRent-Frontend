<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['filter-applied']);

const visible = ref(false);

const districts = ref([
  { id: 1, name: 'San Isidro' },
  { id: 2, name: 'San Miguel' },
  { id: 3, name: 'San Borja' },
]);

const selectedDistrict = ref();
const addressFilter = ref('');

const isFilterApplied = computed(() => {
  return selectedDistrict.value || (addressFilter.value && addressFilter.value.trim() !== '');
});

const applyFilters = () => {
  if (isFilterApplied.value) {
    emit('filter-applied', {
      district: selectedDistrict.value,
      address: addressFilter.value
    });
    visible.value = false;
  }
};

const clearFilters = () => {
  selectedDistrict.value = null;
  addressFilter.value = '';
  emit('filter-applied', { district: null, address: '' });
}

onMounted(() => {
  visible.value = true;
});

const handleClose = () => {
  if (isFilterApplied.value) {
    visible.value = false;
  }
};
</script>

<template>
  <div class="filtering">
    <div class="button-wrapper flex justify-end">
      <Button @click="visible=true" variant="text" icon="pi pi-filter" label="Filtrar" class="justify-end"/>
    </div>
    <Drawer
      v-model:visible="visible"
      position="right"
      class="filter-drawer md:!w-80 lg:!w-[30rem] !w-full"
      :closable="isFilterApplied"
      @hide="handleClose"
    >
      <div class="filter-header mb-4">
        <h2 class="text-lg font-bold">Selecciona un filtro para comenzar</h2>
        <p v-if="!isFilterApplied" class="text-red-500 text-sm">Debes seleccionar al menos un filtro para continuar</p>
      </div>
      <div class="accordion-container">
        <Accordion>
          <AccordionPanel value="0">
            <AccordionHeader class="text-center">Filtrar por distrito</AccordionHeader>
            <AccordionContent>
              <div>
                <Dropdown
                  v-model="selectedDistrict"
                  :options="districts"
                  optionLabel="name"
                  placeholder="Selecciona un distrito"
                  class="w-full"
                />
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader class="text-center">Filtrar por dirección</AccordionHeader>
            <AccordionContent>
              <div>
                <InputText v-model="addressFilter" placeholder="Escribe una dirección" class="w-full" />
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
      <div class="button-container flex justify-between mt-4 gap-2">
        <Button
          label="Limpiar"
          class="w-full"
          severity="secondary"
          @click="clearFilters"
        />
        <Button
          label="Aplicar"
          class="w-full"
          @click="applyFilters"
          :disabled="!isFilterApplied"
        />
      </div>
    </Drawer>
  </div>
</template>

<style scoped>
.filter-drawer {
  width: 30rem;
  max-width: 90vw;
}

.accordion-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


:deep(.p-button .pi-filter) {
  color: #000000;
  font-size: 1.1rem;
  font-weight: bold;
}

:deep(.p-button) {
  color: #000000;
  font-weight: bold;
}

.accordion-container :deep(.p-accordion) {
  width: 100%;
}

.accordion-container :deep(.p-accordion-tab) {
  margin-bottom: 0.5rem;
}

.filter-header {
  text-align: center;
}
</style>
