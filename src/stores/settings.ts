import { defineStore } from 'pinia'

/**
 * Exemple settings store
 *
 * This store is added in storage store, so while user is not get from localForage app is waiting..
 */
export const useSettingsStore = defineStore({
  id: 'settings',

  state: () => {
    return {
      user: undefined
    }
  },

  getters: {
  },

  actions: {
  },

  persist: {
    enabled: true,
    // If strategies is no set, all keys are saved
    strategies: [
      {
        paths: ['user'], // we saved only user key in localForage
      },
    ],
  },
})
