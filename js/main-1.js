import axios from 'axios'
import axiosClient from './api/axiosClient'
import postApi from './api/posiApi'

console.log('hello')
const queryParams = {
  _page: 1,
  _limit: 5,
}

async function main() {
  // const response = await.axiosClient.get('/posts')
  const response = await postApi.getAll()
  console.log(response)
}

main()
