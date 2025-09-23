import axios from 'axios'
const gamesUrl = 'http://localhost:3001/games'
const ratingsUrl = 'http://localhost:3001/ratings'

export const getAllGames = () => {
  return axios.get(gamesUrl).then(response => response.data)
}

export const getGameById = (id: string) => {
  return axios.get(`${gamesUrl}/${id}`).then(response => response.data)
}

export const getGameRatings = (id: string) => {
  return axios.get(`${ratingsUrl}?game=${id}`).then(response => response.data)
}

export const postNewRating = (gameId: number, newScore: number) => {
  const newRating = {
    // la id es asignada por el backend
    'game': gameId,
    'score': newScore
  }

  return axios.post(`${ratingsUrl}`, newRating)
}

export default { getAllGames, getGameById, getGameRatings, postNewRating }