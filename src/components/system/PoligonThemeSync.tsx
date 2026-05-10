import { useEffect } from 'react'

import { useLogcomStore } from '../../store/useLogcomStore'

export function PoligonThemeSync() {
  const poligonMode = useLogcomStore((state) => state.poligonMode)

  useEffect(() => {
    document.documentElement.classList.toggle('poligon', poligonMode)
  }, [poligonMode])

  return null
}
