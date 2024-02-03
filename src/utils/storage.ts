export let localStorageResolve: CallableFunction

export const localStorageReady = new Promise((resolve) => {
  localStorageResolve = resolve
})
