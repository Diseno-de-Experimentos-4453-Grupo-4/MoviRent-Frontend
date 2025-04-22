<script setup>
import { ref } from 'vue';
import FilteringDrawer from '@/searching/components/filtering-drawer.vue'
import ScooterList from '@/searching/components/scooter-list.vue'

const activeFilters = ref({
  district: null,
  address: ''
});

const handleFilterApplied = (filters) => {
  activeFilters.value = filters;
};
</script>

<template>
  <section class="scooter-view">
    <h1 class="pl-6 text-2xl font-bold mb-4">Scooters disponibles</h1>
    <div class="button-wrapper pr-6">
      <FilteringDrawer @filter-applied="handleFilterApplied"/>
    </div>
    <div class="scooter-list pt-5">
      <ScooterList :filters="activeFilters"/>
    </div>
  </section>
</template>

<style scoped>

</style>
