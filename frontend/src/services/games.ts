import axios from 'axios'
const baseUrl = 'http://localhost:3001/games'

export const getAllGames = () => {
  return axios.get(baseUrl).then(response => response.data)
}

export const getGameById = (id: string) => {
  return axios.get(`${baseUrl}/${id}`).then(response => response.data)
}

export default { getAllGames, getGameById }