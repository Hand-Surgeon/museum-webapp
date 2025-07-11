// Debug utilities for troubleshooting loading issues

export const debugLog = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${message}`, data || '')
  }
}

export const debugError = (message: string, error: unknown) => {
  if (import.meta.env.DEV) {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] ${message}`, error)
  }
}

// Track component mount/unmount for debugging
export const useDebugLifecycle = (componentName: string) => {
  if (import.meta.env.DEV) {
    import('react').then(({ useEffect }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        debugLog(`${componentName} mounted`)
        return () => {
          debugLog(`${componentName} unmounted`)
        }
      }, [])
    })
  }
}
