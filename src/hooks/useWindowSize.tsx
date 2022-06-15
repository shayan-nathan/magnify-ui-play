import React, { useEffect } from 'react'

export const headerHeight = 80
export const sidebarWidth = 265

interface WindowSize {
  width: number
  height: number
}
export default function useWindowSize() {
  const isSSR = typeof window === 'undefined'
  const [windowSize, setWindowSize] = React.useState<WindowSize>({
    width: isSSR ? 1200 : window.innerWidth,
    height: isSSR ? 800 : window.innerHeight,
  })

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }

  useEffect(() => {
    window.addEventListener('resize', changeWindowSize)

    return () => {
      window.removeEventListener('resize', changeWindowSize)
    }
  }, [])

  return windowSize
}
