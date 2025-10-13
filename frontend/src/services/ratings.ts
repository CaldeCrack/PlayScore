import axios from 'axios'


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
  return axios.delete(`${ratingsUrl}/${id}`).then(response => response.data)
}

const postRating = (userId: string, gameId: string, score: number) => {
  const rating = { 'user': userId, 'game': gameId, 'score': score }

  return axios.post(`${ratingsUrl}`, rating)
}

const updateRating = (id: string, score: number) => {
  return axios.put(`${ratingsUrl}/${id}`, { score }).then(response => response.data)
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
