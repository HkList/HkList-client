import { useConfigStore } from '@renderer/stores/config.ts'

function setDark(event: MediaQueryList | MediaQueryListEvent) {
  if (event.matches) {
    document.documentElement.setAttribute('theme-mode', 'dark')
  } else {
    document.documentElement.removeAttribute('theme-mode')
  }
}

export const useDark = () => {
  const configStore = useConfigStore()
  const theme = configStore.config.general.theme
  const match = window.matchMedia('(prefers-color-scheme: dark)')
  match.removeEventListener('change', setDark)

  if (theme === 'light') {
    document.documentElement.setAttribute('theme-mode', 'light')
  } else if (theme === 'dark') {
    document.documentElement.setAttribute('theme-mode', 'dark')
  } else {
    setDark(match)
    match.addEventListener('change', setDark)
  }
}
