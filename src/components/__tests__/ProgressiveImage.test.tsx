import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ProgressiveImage from '../ProgressiveImage'

describe('ProgressiveImage', () => {
  it('renders with placeholder initially', () => {
    const placeholderSrc = 'placeholder.jpg'
    render(<ProgressiveImage src="full.jpg" alt="Test image" placeholderSrc={placeholderSrc} />)

    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('src', placeholderSrc)
  })

  it('loads full image after mount', async () => {
    const src = 'full.jpg'

    // Mock Image constructor
    global.Image = vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn((event, handler) => {
        if (event === 'load') {
          setTimeout(handler, 100)
        }
      }),
      removeEventListener: vi.fn(),
      src: '',
    }))

    render(<ProgressiveImage src={src} alt="Test image" placeholderSrc="placeholder.jpg" />)

    await waitFor(() => {
      const img = screen.getByAltText('Test image')
      expect(img).toHaveAttribute('src', src)
    })
  })

  it('handles image error', () => {
    const onError = vi.fn()

    render(<ProgressiveImage src="invalid.jpg" alt="Test image" onError={onError} />)

    const img = screen.getByAltText('Test image')
    img.dispatchEvent(new Event('error'))

    expect(onError).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ProgressiveImage src="test.jpg" alt="Test image" className="custom-class" />
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('sets loading attribute', () => {
    render(<ProgressiveImage src="test.jpg" alt="Test image" loading="eager" />)

    const img = screen.getByAltText('Test image')
    expect(img).toHaveAttribute('loading', 'eager')
  })
})
