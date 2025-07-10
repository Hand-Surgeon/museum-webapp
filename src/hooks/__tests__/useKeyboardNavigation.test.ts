import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardNavigation } from '../useKeyboardNavigation'

describe('useKeyboardNavigation', () => {
  it('calls onEscape when Escape key is pressed', () => {
    const onEscape = vi.fn()
    
    renderHook(() => useKeyboardNavigation({ onEscape }))
    
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    window.dispatchEvent(event)
    
    expect(onEscape).toHaveBeenCalled()
  })

  it('calls onEnter when Enter key is pressed', () => {
    const onEnter = vi.fn()
    
    renderHook(() => useKeyboardNavigation({ onEnter }))
    
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)
    
    expect(onEnter).toHaveBeenCalled()
  })

  it('calls arrow key handlers', () => {
    const handlers = {
      onArrowLeft: vi.fn(),
      onArrowRight: vi.fn(),
      onArrowUp: vi.fn(),
      onArrowDown: vi.fn()
    }
    
    renderHook(() => useKeyboardNavigation(handlers))
    
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    keys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key })
      window.dispatchEvent(event)
    })
    
    expect(handlers.onArrowLeft).toHaveBeenCalled()
    expect(handlers.onArrowRight).toHaveBeenCalled()
    expect(handlers.onArrowUp).toHaveBeenCalled()
    expect(handlers.onArrowDown).toHaveBeenCalled()
  })

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => 
      useKeyboardNavigation({ onEscape: vi.fn() })
    )
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    )
  })

  it('does not call handlers for other keys', () => {
    const onEscape = vi.fn()
    
    renderHook(() => useKeyboardNavigation({ onEscape }))
    
    const event = new KeyboardEvent('keydown', { key: 'a' })
    window.dispatchEvent(event)
    
    expect(onEscape).not.toHaveBeenCalled()
  })
})