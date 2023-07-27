import postApi from './api/postsApi'
import { setTextContent, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

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
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function handleFilterChange(filterName, filerValue) {
  // update query params
  const url = new URL(window.location)
  url.searchParams.set(filterName, filerValue)
  history.pushState({}, '', url)

  //  fetch API
  // re-render post List
}

function handlePrevClick(e) {
  e.preventDefault()
  console.log('prev click')
}
function handleNextClick(e) {
  e.preventDefault()
  console.log('next click')
}

function initPagination() {
  // bind click event for prev/next link
  const ulPagination = document.getElementById('pagination')
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

;(async () => {
  try {
    initPagination()
    initURL()

    const queryParams = new URLSearchParams(window.location.search)
    // set default query if not exited
    console.log(queryParams.toString())

    const { data, pagination } = await postApi.getAll(queryParams)
    console.log(data)
    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
