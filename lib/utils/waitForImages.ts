export async function waitForImagesToLoad(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll('img'))

  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true })
        img.addEventListener('error', () => resolve(), { once: true })
      })
    })
  )

  // wait for all web fonts to finish loading — text can shift width mid-swap otherwise
  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}