import axios from 'axios'
import axiosClient from './api/axiosClient'
import postApi from './api/postsApi'

console.log('hello')

async function main() {
  // const response = await axiosClient.get('/posts')
  // const response = await axios.get('/posts')
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const data = await postApi.getAll(queryParams)
    console.log('main.js data', data)
  } catch (error) {
    console.log('get all failed', error)
  }
  // await postApi.getById('1121')
  await postApi.update({
    id: 'lea11ziflg8xoiy1',
    title: 'Sint officia amet 123',
  })

  await postApi.updateFormData({
    id: 'lea11ziflg8xoiy1',
    title: 'Sint officia amet 123',
  })
}

main()
