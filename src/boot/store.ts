import { boot } from 'quasar/wrappers'
import {useStorageStore} from '@/stores/storage'

export default boot(() => {
  const storageStore = useStorageStore()
  storageStore.initStorePromises()
})
