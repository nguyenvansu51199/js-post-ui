export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId)
  if (!pagination || !ulPagination) return

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enable/disabled prev/next link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next link
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  // set current active page
  // TODO: use default params

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('prev click')

      const page = Number.parseInt(ulPagination.dataset.page) || 1
      console.log('page', page)
      if (page > 2) onChange(page - 1)
    })
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('next click')

      const page = Number.parseInt(ulPagination.dataset.page) || 1
      console.log(page)

      const totalPages = ulPagination.dataset.totalPages
      if (page < totalPages) onChange(page + 1)
    })
  }
}
