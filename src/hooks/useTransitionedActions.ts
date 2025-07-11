import { useTransition, useMemo } from 'react'

type ActionFn = (...args: unknown[]) => void

export function useTransitionedActions<T extends Record<string, ActionFn>>(
  actions: T
): T & { isPending: boolean } {
  const [isPending, startTransition] = useTransition()

  const transitionedActions = useMemo(() => {
    return Object.entries(actions).reduce((acc, [key, action]) => {
      ;(acc as Record<string, ActionFn>)[key] = (...args: Parameters<typeof action>) => {
        startTransition(() => {
          action(...args)
        })
      }
      return acc
    }, {} as T)
  }, [actions])

  return { ...transitionedActions, isPending }
}
