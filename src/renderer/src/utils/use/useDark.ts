export const useDark = () => {
  const match = window.matchMedia('(prefers-color-scheme: dark)')
  setDark(match)
  match.addEventListener('change', setDark)
  function setDark(event: MediaQueryList | MediaQueryListEvent) {
    if (event.matches) {
      document.documentElement.setAttribute('theme-mode', 'dark')
    } else {
      document.documentElement.removeAttribute('theme-mode')
    }
  }
}
