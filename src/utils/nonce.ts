// Generate a random nonce for CSP
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}

// Store nonce in a meta tag for client-side access
export function setNonceMeta(nonce: string): void {
  const meta = document.createElement('meta')
  meta.name = 'csp-nonce'
  meta.content = nonce
  document.head.appendChild(meta)
}

// Get nonce from meta tag
export function getNonce(): string | null {
  const meta = document.querySelector('meta[name="csp-nonce"]')
  return meta ? meta.getAttribute('content') : null
}
