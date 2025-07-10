import { useDeferredValue, useTransition, useState, useCallback } from 'react'

export function useDeferredSearch(searchTerm: string) {
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const isStale = searchTerm !== deferredSearchTerm
  
  return {
    searchTerm: deferredSearchTerm,
    isSearching: isStale
  }
}

export function useTransitionedState<T>(initialState: T) {
  const [state, setState] = useState(initialState)
  const [isPending, startTransition] = useTransition()
  
  const setStateWithTransition = useCallback((newState: T | ((prev: T) => T)) => {
    startTransition(() => {
      setState(newState)
    })
  }, [])
  
  return [state, setStateWithTransition, isPending] as const
}