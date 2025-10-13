import axios from 'axios'
import type User from '../types/User'


const usersUrl = '/api/users'

const getAllUsers = () => {
  return axios.get(usersUrl).then(response => response.data)
}

const getUserById = (id: string) => {
  return axios.get(`${usersUrl}/${id}`).then(response => response.data)
}

const postUser = (user: User) => {
  return axios.post(`${usersUrl}`, user)
}

export default { getAllUsers, getUserById, postUser }