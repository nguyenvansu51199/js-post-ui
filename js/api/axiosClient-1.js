import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://js-post-api.herokuapp.com/api',
  header: {
    'Content-type': 'aplication/json',
  },
})

export default axiosClient
