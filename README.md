# Quasar App (quasar-pinia-localforage)
Wait for the global promise to be resolved before displaying the route

### Dependencies
- lodash.cloneDeep
- lodash.get
- lodash.set

### List of modified files :
- src/router/index.ts (wait store beforeEach route)
- src/stores/index.ts (add plugin in pinia)

### List of new files
- src/boot/store.ts (Quasar boot file, call storageStore and init global promise)
- src/stores/storage.ts (This store manages all stores that need to be persisted)
- src/stores/settings.ts (Exemple store, we saved user)
- src/utils/storage.ts (Global promise)
- src/stores/plugins/persistPlugin.ts (Plugin file)

### Exemples of projects used this plugin
- https://github.com/loicngr/kdrive-notes
