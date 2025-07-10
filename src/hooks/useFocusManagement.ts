import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function useFocusManagement() {
  const location = useLocation()
  const previousLocationRef = useRef(location.pathname)

  useEffect(() => {
    // Focus management on route change
    if (previousLocationRef.current !== location.pathname) {
      previousLocationRef.current = location.pathname
      
      // Find main content and focus
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.focus()
        // Announce page change to screen readers
        const announcement = document.createElement('div')
        announcement.setAttribute('role', 'status')
        announcement.setAttribute('aria-live', 'polite')
        announcement.setAttribute('aria-atomic', 'true')
        announcement.className = 'sr-only'
        announcement.textContent = `Page loaded: ${document.title}`
        document.body.appendChild(announcement)
        
        setTimeout(() => {
          document.body.removeChild(announcement)
        }, 1000)
      }
    }
  }, [location])
}

export function useTrapFocus(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        // Trigger close action
        container.dispatchEvent(new CustomEvent('close-modal'))
      }
    }

    container.addEventListener('keydown', handleTabKey)
    container.addEventListener('keydown', handleEscapeKey)
    
    // Focus first element
    firstFocusable?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      container.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isActive, containerRef])
}