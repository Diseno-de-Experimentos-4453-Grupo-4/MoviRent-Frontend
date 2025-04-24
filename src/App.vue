<script setup>
import TheNavbar from '@/public/components/the-navbar.vue';
import TheFooter from '@/public/components/the-footer.vue';
import FilteringDrawer from '@/searching/components/filtering-drawer.vue'
import ScooterList from '@/searching/components/scooter-list.vue'
import ScooterSearchingView from '@/searching/views/scooter-searching-view.vue'
</script>

<template>
  <TheNavbar />
  <router-view/>
  <TheFooter />
</template>

<style scoped>

</style>
