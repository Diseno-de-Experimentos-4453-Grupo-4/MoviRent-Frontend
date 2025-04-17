<script setup>
import { ref } from 'vue';

const visible = ref(false);
</script>

<template>
  <header class="bg-white align-top flex-row">
    <Toolbar class="p-1.5 flex border-0 toolbar" >

      <template #start>
        <Button variant="text">
          <img src="../../assets/logo.svg" alt="Logo" class="w-14 h-14 md:w-18 md:h-18" />
        </Button>
      </template>

      <template #end>
        <div class="desktop-menu flex items-center gap-12 font-bold">
          <Button label="Mis scooters" variant="text"/>
          <Button label="Buscar" variant="text"/>
          <Button label="Perfil" variant="text"/>
          <Button label="Mi suscripción" variant="text"/>
        </div>

        <div class="mobile-menu card flex justify-center">
            <Drawer v-model:visible="visible" position="right">
              <div class="drawer-menu flex flex-col gap-4 p-4">
                <Button label="Mis scooters" variant="outlined" class="justify-end"/>
                <Button label="Buscar" variant="outlined" class="justify-end"/>
                <Button label="Perfil" variant="outlined" class="justify-end"/>
                <Button label="Mi suscripción" variant="outlined" class="justify-end"/>
              </div>
            </Drawer>
          <Button @click="visible=true" variant="text" icon="pi pi-bars" />
        </div>
      </template>

    </Toolbar>
  </header>
</template>

<style scoped>

.toolbar{
  border: none;
}

:deep(.p-button .p-button-label) {
  color: #000000;
  font-weight: bold;
}

:deep(.p-button .pi-bars) {
  font-size: 1.5rem;
}

.mobile-menu {
  display: none;
}

@media screen and (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: block;
  }
}
</style>
