import axiosSecure from '../utils/axiosSecure'


const gamesUrl = '/api/games'

const favoriteGame = (id: string) => {
  return axiosSecure.post(`${gamesUrl}/favorite/${id}`).then(res => res.data)
}

const unfavoriteGame = (id: string) => {
  return axiosSecure.delete(`${gamesUrl}/favorite/${id}`).then(res => res.data)
}

export default { favoriteGame, unfavoriteGame }
