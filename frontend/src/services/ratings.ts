import axios from 'axios'
import axiosSecure from '../utils/axiosSecure'


const ratingsUrl = '/api/ratings'

const getAllRatings = () => {
  return axios.get(ratingsUrl).then(response => response.data)
}

const getRatingById = (id: string) => {
  return axios.get(`${ratingsUrl}/${id}`).then(response => response.data)
}

const getGameRatings = (id: string) => {
  return axios.get(`${ratingsUrl}/game/${id}`).then(response => response.data)
}

const getUserRatings = (id: string) => {
  return axios.get(`${ratingsUrl}/user/${id}`).then(response => response.data)
}

const deleteRating = (id: string) => {
  return axiosSecure.delete(`${ratingsUrl}/${id}`).then(response => response.data)
}

const postRating = (userId: string, gameId: string, score: number) => {
  const rating = { 'user': userId, 'game': gameId, 'score': score }

  return axiosSecure.post(`${ratingsUrl}`, rating)
}

const updateRating = (id: string, score: number) => {
  return axiosSecure.put(`${ratingsUrl}/${id}`, { score }).then(response => response.data)
}

export default {
  getAllRatings,
  getRatingById,
  getGameRatings,
  getUserRatings,
  deleteRating,
  postRating,
  updateRating
}
