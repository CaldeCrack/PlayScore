import axios from 'axios'


const usersUrl = '/api/users'

const getAllUsers = () => {
  return axios.get(usersUrl).then(response => response.data)
}

const getUserById = (id: string) => {
  return axios.get(`${usersUrl}/${id}`).then(response => response.data)
}

export interface PostUser {
  name: string
  username: string
  email: string
  password: string
}

const postUser = (user: PostUser) => {
  return axios.post(`${usersUrl}`, user)
}

export default { getAllUsers, getUserById, postUser }