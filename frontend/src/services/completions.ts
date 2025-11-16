import axios from 'axios'
import axiosSecure from '../utils/axiosSecure'
import type Completion from '../types/Completion'


const completionsUrl = '/api/completions'

const getAllCompletions = () => {
  return axios.get(completionsUrl).then(res => res.data)
}

const getCompletionById = (id: string) => {
  return axios.get(`${completionsUrl}/${id}`).then(res => res.data)
}

const getGameCompletions = (id: string) => {
  return axios.get(`${completionsUrl}/game/${id}`).then(res => res.data)
}

const getUserCompletions = (id: string) => {
  return axios.get(`${completionsUrl}/user/${id}`).then(res => res.data)
}

const getUserGameCompletion = (userId: string, gameId: string) => {
  return axios
    .get(`${completionsUrl}/user/${userId}/game/${gameId}`)
    .then(res => res.data)
}

const deleteCompletion = (id: string) => {
  return axiosSecure.delete(`${completionsUrl}/${id}`).then(res => res.data)
}

const postOrUpdateCompletion = async (
  userId: string,
  gameId: string,
  main_story: number,
  main_plus_extras?: number,
  completionist?: number
) => {
  const gameCompletions = await getGameCompletions(gameId)

  const existing = gameCompletions.find((c: Completion) => c.user.id === userId)

  const payload = {
    user: userId,
    game: gameId,
    main_story,
    main_plus_extras,
    completionist
  }

  if (existing) {
    return axiosSecure
      .put(`${completionsUrl}/${existing.id}`, payload)
      .then(res => res.data)
  } else {
    return axiosSecure
      .post(completionsUrl, payload)
      .then(res => res.data)
  }
}

export default {
  getAllCompletions,
  getCompletionById,
  getGameCompletions,
  getUserCompletions,
  getUserGameCompletion,
  deleteCompletion,
  postOrUpdateCompletion
}
