<script setup>
import { ref } from "vue"

const items_explora = ref ([
  {
    label: 'Explora e informa',
    items: [
      {
        label: 'Danos tu opinión'
      },
      {
        label: 'Preguntas frecuentes'
      },
      {
        label: 'Política de privacidad'
      }
    ]
  },
])

const items_redes = ref ([
  {
    label: 'Redes sociales',
    items: [
      {
        label: 'Facebook'
      },
      {
        label: 'Instagram'
      },
      {
        label: 'Twitter'
      }
    ]
  },
])

const item_soporte = ref ([
  {
    label: 'Soporte',
    items: [
      {
        icon: 'pi pi-whatsapp',
      },
    ]
  }
])

</script>

<template>
  <footer class="flex flex-col items-center justify-center p-4 footer ">
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 pb-2.5 gap-4">
      <Menu :model="items_explora" class="col-span-1"/>
      <Menu :model="items_redes" class="col-span-1"/>
      <Menu :model="item_soporte" class="col-span-1 support-menu"/>
    </div>
    <div class="mt-9">
      <p class="text-center ">©Movirent 2025. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer{
  margin-top: auto;
  width: 100%;
  background-color: var(--color-primary)
}

:deep(.p-menu) {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

:deep(.p-menu-submenu-label){
  font-weight: bold;
  color: black;
  font-size: 1rem;
}

:deep(.p-menu-item-label){
  color: black;
}

:deep(.p-menuitem) {
  background: transparent;
}

:deep(.p-menu-item-icon) {
  color: white;
  font-size: 2.5rem;
}


</style>
