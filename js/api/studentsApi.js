import axiosClient from './axiosClient'

const studentsApi = {
  getAll(params) {
    const url = '/students'
    return axiosClient.get(url, { params })
  },

  getByid(id) {
    const url = `/students/${id}`
    return axiosClient.get(url)
  },

  add(data) {
    const url = 'students'
    return axiosClient.get(url, data)
  },

  update(data) {
    const url = `/students/${data.id}`
    return axiosClient.patch(url, data)
  },

  remove(id) {
    const url = `/students/${id}`
    return axiosClient.delete(url)
  },
}

export default studentsApi
