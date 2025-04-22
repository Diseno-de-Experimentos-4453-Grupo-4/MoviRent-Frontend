<script setup>
import { ref } from 'vue'

const visible = ref(false);

const districts = ref([
  { id: 1, name: 'Distrito 1' },
  { id: 2, name: 'Distrito 2' },
  { id: 3, name: 'Distrito 3' },
]);

const selectedDistrict = ref();
</script>

<template>
  <div class="filtering">
    <Button @click="visible=true" variant="text" icon="pi pi-filter" label="Filtrar"/>

    <Drawer v-model:visible="visible" position="right" class="filter-drawer md:!w-80 lg:!w-[30rem] !w-full">
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
                <InputText placeholder="Escribe una dirección" class="w-full" />
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
      <div class="button-container flex justify-center mt-4">
        <Button label="Aplicar" class="w-full" @click ="visible=false" />
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
</style>
