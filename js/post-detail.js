import dayjs from 'dayjs'
import postApi from './api/postsApi'
import { setTextContent, registerLightbox } from './utils'

// id="goToEditPageLink"
// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"

// author: 'Kurtis McLaughlin'
// createdAt: 1681016264413
// description: 'et distinctio unde non sed tempore totam autem nihil dolorem officia quisquam perspiciatis voluptatibus doloribus dolores et dolorem sit accusantium inventore dolores asperiores dolorem amet alias voluptatibus voluptas occaecati hic error illum doloribus eius voluptatem possimus sint nemo eum dignissimos est ut id est natus sunt autem quidem hic et'
// id: 'lea11ziflg8xoixq'
// imageUrl: 'https://picsum.photos/id/200/1368/400'
// title: 'Nihil expedita eveniet'
// updatedAt: 1681016264413

function renderPostDetail(post) {
  if (!post) return

  // render title
  setTextContent(document, '#postDetailTitle', post.title)
  // render description
  setTextContent(document, '#postDetailDescription', post.description)
  // render author
  setTextContent(document, '#postDetailAuthor', post.author)
  // render updateAt
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD/MM/YYYY HH:mm')
  )
  // render hero Image (imgaeUrl)
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.background = `url("${post.imageUrl}")`

    heroImage.addEventListener('error', () => {
      console.log('load image error --> use default placeholder')
      thumbnailElement.src = 'https://placehold.co/600x400/png'
    })
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
    editPageLink.textContent = 'Edit Post'
  }
}

;(async () => {
  registerLightbox()
  try {
    // get post id from URL
    // fetch post detail API
    // render post detail
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) {
      console.log('Post not found')
      alert('Not Found')
      return
    }

    const post = await postApi.getById(postId)
    console.log('post', post)
    renderPostDetail(post)
  } catch (error) {
    console.log('Faild to fetch post Detail', error)
  }
})()
