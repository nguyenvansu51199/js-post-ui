import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './common'

// to use fromNow function
dayjs.extend(relativeTime)

export function createPostElement(post) {
  if (!post) return

  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // update title, description, author, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
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

export function renderPostList(elementId, postList) {
  console.log(postList)
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
