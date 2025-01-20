export const invoke = <T = void>(method: string, data = {}) => {
  return window.ElectronAPI.ipcRenderer.invoke(method, data) as Promise<T>
}
