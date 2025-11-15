import axios from 'axios'
import axiosSecure from '../utils/axiosSecure'


const gamesUrl = '/api/games'

const getAllGames = () => {
  return axios.get(gamesUrl).then(response => response.data)
}

const getGameById = (id: string) => {
  return axios.get(`${gamesUrl}/${id}`).then(response => response.data)
}

const deleteGame = (id: string) => {
  return axiosSecure.delete(`${gamesUrl}/${id}`).then(response => response.data)
}

const postGame = (game: FormData) => {
  return axiosSecure.post(`${gamesUrl}`, game)
}

export default { getAllGames, getGameById, deleteGame, postGame }
