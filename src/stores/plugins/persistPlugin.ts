import {_DeepPartial, PiniaPluginContext, StateTree, Store} from "pinia"
import {useStorageStore} from "@/stores/storage"
import {createInstance} from "localforage"
import cloneDeep from 'lodash.clonedeep'
import get from 'lodash.get'
import set from 'lodash.set'

export interface PersistStrategy {
  key?: string
  paths?: string[]
}

export interface PersistOptions {
  enabled: true
  strategies?: PersistStrategy[]
}

type PartialState = Partial<Store['$state']>

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: PersistOptions
  }
}

let localForageInstance: LocalForage
const localForageOptions = {
  name: 'YOUR_STORAGE_KEY', // Here fill your storageKey
}

export const updateStorage = (strategy: PersistStrategy, store: Store) => {
  if (typeof localForageInstance === 'undefined' || localForageInstance === null) {
    localForageInstance = createInstance(cloneDeep(localForageOptions))
  }

  const storeKey = strategy.key ?? store.$id
  const paths = strategy?.paths ?? []

  if (paths.length > 0) {
    const partialState = paths.reduce<PartialState>((
      finalObj,
      key,
    ) => {
      set(finalObj, key, get(store.$state, key))
      return finalObj
    }, {})

    void localForageInstance.setItem(storeKey, cloneDeep(partialState))
  } else {
    void localForageInstance.setItem(storeKey, cloneDeep(store.$state))
  }
}

export default ({ options, store }: PiniaPluginContext): void => {
  const storageStore = useStorageStore()

  const persist: PersistOptions | undefined = options.persist
  const persistEnabled: boolean = get(options, ['persist', 'enabled'], false)

  if (persist === undefined || !persistEnabled) {
    return
  }

  if (typeof localForageInstance === 'undefined' || localForageInstance === null) {
    localForageInstance = createInstance(cloneDeep(localForageOptions))
  }

  const strategies = get(persist, 'strategies', [{
    key: store.$id,
  }] as PersistStrategy[])

  strategies.forEach((strategy) => {
    const storeId = strategy.key ?? store.$id

    void localForageInstance
      .getItem(storeId)
      .then((storageResult) => {
        if (storageResult !== null) {
          store.$patch(storageResult as _DeepPartial<StateTree>)
          updateStorage(strategy, store)
        }
      })
      .finally(() => {
        const item = storageStore.storePromises.find(({ id }) => id === storeId)

        if (typeof item?.resolve === 'function') {
          item.resolve()
        }
      })
  })

  store.$subscribe(() => {
    strategies.forEach((strategy) => {
      updateStorage(strategy, store)
    })
  })
}
