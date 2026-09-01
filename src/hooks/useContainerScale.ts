import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

export function useContainerScale(ref: RefObject<HTMLDivElement | null>, baseWidth: number): number {
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateScale = (width: number) => {
      setScale(width / baseWidth)
    }

    updateScale(element.clientWidth)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        updateScale(entry.contentRect.width)
      }
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, baseWidth])

  return scale
}
