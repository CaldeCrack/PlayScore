import axios from 'axios'
import type { Game } from '../types/Game'


const gamesUrl = '/api/games'

const getAllGames = () => {
  return axios.get(gamesUrl).then(response => response.data)
}

const getGameById = (id: string) => {
  return axios.get(`${gamesUrl}/${id}`).then(response => response.data)
}

const deleteGame = (id: string) => {
  return axios.delete(`${gamesUrl}/${id}`).then(response => response.data)
}

const postGame = (game: Omit<Game, 'id'>) => {
  return axios.post(`${gamesUrl}`, game)
}

export default { getAllGames, getGameById, deleteGame, postGame }