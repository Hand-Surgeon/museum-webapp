import { useTransition, useCallback } from 'react'

type ActionFn = (...args: any[]) => void

export function useTransitionedActions<T extends Record<string, ActionFn>>(
  actions: T
): T & { isPending: boolean } {
  const [isPending, startTransition] = useTransition()
  
  const transitionedActions = Object.entries(actions).reduce((acc, [key, action]) => {
    acc[key] = useCallback((...args: Parameters<typeof action>) => {
      startTransition(() => {
        action(...args)
      })
    }, [action])
    return acc
  }, {} as T)
  
  return { ...transitionedActions, isPending }
}