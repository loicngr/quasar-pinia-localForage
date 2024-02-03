import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import { localStorageResolve } from '@/utils/storage'
import { useSettingsStore } from '@/stores/settings'

export interface StateStorage {
  promises: Array<{
    id: string,
    promise: Promise<unknown>,
    resolve: CallableFunction | undefined
  }>
}

export const useStorageStore = defineStore({
  id: 'storage',

  state: (): StateStorage => ({
    promises: [],
  }),

  getters: {
    storePromises: (state) => state.promises,
  },

  actions: {
    initStorePromises () {
      const stores = [
        // Import your persisted store here,
        // Here exemple with settingsStore
        useSettingsStore(),
      ]

      this.promises = stores
        .map(({
          $id: id,
        }) => {
          let resolvePromise: CallableFunction | undefined
          return {
            id,
            promise: new Promise((resolve) => {
              resolvePromise = resolve
            }),
            resolve: resolvePromise,
          }
        })

      void Promise.all(this.promises.map(({
        promise,
      }) => promise))
        .then(() => {
          void nextTick(() => {
            // Store is ready, so we resolve global promise
            localStorageResolve()
          })
        })
    },
  },
})
