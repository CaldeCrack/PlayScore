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

export const postNewRating = async (gameId: number, newScore: number) => {
  const res = await axios.get(ratingsUrl);
  const data = Array.isArray(res.data) ? res.data : [];

  const newRating = {
    "id": data.length + 1,
    "game": gameId,
    "score": newScore 
  };

  axios.post(`${ratingsUrl}`, newRating)
}

export default { getAllGames, getGameById, getGameRatings, postNewRating}