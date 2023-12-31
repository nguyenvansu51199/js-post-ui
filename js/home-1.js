import postApi from './api/postsApi'
import { getUlPagination, setTextContent, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'lodash.debounce'

// to use fromNow function
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // update title, description, author, thumbnail
  // const titleElement = liElement.querySelector('[data-id="title"]')
  // if (titleElement) titleElement.textContent = post.title
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))

  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if (authorElement) authorElement.textContent = post.author

  // const descriptionElement = liElement.querySelector('[data-id="description"]')
  // if (descriptionElement) descriptionElement.textContent = post.description

  // calculate timespan
  console.log(dayjs(post.updateAt).fromNow())
  setTextContent(liElement, '[data-id="timeSpan"]', dayjs(post.updateAt).fromNow())

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      console.log('load image error --> use default placeholder')
      thumbnailElement.src = 'https://placehold.co/600x400/png'
    })
  }

  // if
  // attach events

  return liElement
}

function renderPostList(postList) {
  console.log(postList)
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination()
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

async function handleFilterChange(filterName, filerValue) {
  // update query params
  try {
    const url = new URL(window.location)
    url.searchParams.set(filterName, filerValue)

    // reset page
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    //  fetch API
    // re-render post List
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('failed to fetch post list')
  }
}

function handlePrevClick(e) {
  e.preventDefault()
  console.log('prev click')
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  console.log('page', page)
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}
function handleNextClick(e) {
  e.preventDefault()
  console.log('next click')
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  console.log(page)

  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  // bind click event for prev/next link
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function initURL() {
  const url = new URL(window.location)

  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

function initSearch() {
  const searchInput = document.getElementById('searchInput')
  if (!searchInput) return

  // set default values form query params
  // title_like
  const queryParams = new URLSearchParams(window.location.search)
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like')
  }
  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  )
  searchInput.addEventListener('input', debounceSearch)
}

;(async () => {
  try {
    initPagination()
    initSearch()
    const queryParams = new URLSearchParams(window.location.search)
    // set default query if not exited
    initURL()
    console.log(queryParams.toString())

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    renderPagination(pagination)
    console.log('data', data)
    console.log('pagination', pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
