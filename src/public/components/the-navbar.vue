<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import auth from '@/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = useRouter();
const visible = ref(false);
const currentUser = ref(null);
let unsubscribe = null;

const handleLogout = async () => {
  await auth.logout();
  router.push('/login');
};

onMounted(() => {
  const auth = getAuth();
  unsubscribe = onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <header class="bg-white align-top flex-row">
    <Toolbar class="p-1.5 flex border-0 toolbar">
      <template #start>
        <Button variant="text">
          <img src="../../assets/logo.svg" alt="Logo" class="w-14 h-14 md:w-15 md:h-15" />
        </Button>
      </template>

      <template #end>
        <div class="desktop-menu flex items-center gap-12 font-bold">
          <Button label="Mis scooters" variant="text" @click="$router.push('/mis-scooters')" />
          <Button label="Buscar" variant="text" @click="$router.push('/buscar')" />
          <Button label="Perfil" variant="text" @click="$router.push('/perfil')" />
          <Button label="Mi suscripción" variant="text" @click="$router.push('/suscripcion')" />
          <Button
            v-if="currentUser"
            label="Cerrar sesión"
            severity="danger"
            @click="handleLogout"
            class="logout-button"
          />
        </div>

        <div class="mobile-menu card flex justify-center">
          <Drawer v-model:visible="visible" position="right">
            <div class="drawer-menu flex flex-col gap-4 p-4">
              <Button label="Mis scooters" variant="outlined" class="justify-end"
                      @click="$router.push('/')" />
              <Button label="Buscar" variant="outlined" class="justify-end"
                      @click="$router.push('/buscar')" />
              <Button label="Perfil" variant="outlined" class="justify-end"
                      @click="$router.push('/perfil')" />
              <Button label="Mi suscripción" variant="outlined" class="justify-end"
                      @click="$router.push('/suscripcion')" />
              <Button
                v-if="currentUser"
                label="Cerrar sesión"
                severity="danger"
                @click="handleLogout"
                class="logout-button"
              />
            </div>
          </Drawer>
          <Button @click="visible=true" variant="text" icon="pi pi-bars" />
        </div>
      </template>
    </Toolbar>
  </header>
</template>

<style scoped>
.toolbar {
  border: none;
}

:deep(.p-button .p-button-label) {
  color: #000000;
  font-weight: bold;
}

:deep(.p-button .pi-bars) {
  font-size: 1.5rem;
}

.logout-button {
  background-color: #ff4444 !important;
  border-color: #ff4444 !important;
  color: white !important;
}

.logout-button:hover {
  background-color: #cc0000 !important;
  border-color: #cc0000 !important;
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
