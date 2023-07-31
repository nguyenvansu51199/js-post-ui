import postApi from './api/postsApi'
import { initPagination, initSearch, renderPagination, renderPostList } from './utils'

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
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list')
  }
}

;(async () => {
  try {
    const url = new URL(window.location)

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = url.searchParams
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })
    // const queryParams = new URLSearchParams(window.location.search)
    // set default query if not exited
    console.log(queryParams.toString())

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postList', data)
    renderPagination('pagination', pagination)
    console.log('data', data)
    console.log('pagination', pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
