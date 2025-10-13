import axios from 'axios'
import axiosSecure from '../utils/axiosSecure'
import type Rating from '../types/Rating'


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

const getUserGameRating = (userId: string, gameId: string) => {
  return axios
    .get(`${ratingsUrl}/user/${userId}/game/${gameId}`)
    .then(response => response.data)
}

const deleteRating = (id: string) => {
  return axiosSecure.delete(`${ratingsUrl}/${id}`).then(response => response.data)
}

const postOrUpdateRating = async (userId: string, gameId: string, score: number) => {
  const gameRatings = await getGameRatings(gameId)

  const existing = gameRatings.find((r: Rating) => r.user.id === userId)

  if (existing) {
    return axiosSecure
      .put(`${ratingsUrl}/${existing.id}`, { score })
      .then(response => response.data)
  } else {
    const rating = { 'user': userId, 'game': gameId, score }
    return axiosSecure
      .post(`${ratingsUrl}`, rating)
      .then(response => response.data)
  }
}

export default {
  getAllRatings,
  getRatingById,
  getGameRatings,
  getUserRatings,
  getUserGameRating,
  deleteRating,
  postOrUpdateRating
}
