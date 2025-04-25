import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)

  function setProfile(userProfile) {
    profile.value = userProfile
  }

  function getProfile() {
    return profile.value
  }

  return {
    profile,
    setProfile,
    getProfile,
  }
})
