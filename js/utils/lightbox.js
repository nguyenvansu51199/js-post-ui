export function registerLightbox() {
  // handle click for all images --> Event delegation
  // img click --> find all imgs with the same album / gallery
  // determine index of selected img
  // show model with selected img
  // handle prev / next click

  document.addEventListener('click', (event) => {
    console.log('click', event.target)
  })
}
