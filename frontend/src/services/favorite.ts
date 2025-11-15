import axiosSecure from '../utils/axiosSecure'


const favoritesUrl = '/api/favorite'

const getFavoritedBy = (gameId: string) => {
  return axiosSecure.get(`${favoritesUrl}/game/${gameId}`)
    .then(res => res.data)
}

const getUserFavorites = (userId: string) => {
  return axiosSecure.get(`${favoritesUrl}/user/${userId}`)
    .then(res => res.data)
}

const getUserFavoritedGame = (gameId: string, userId: string) => {
  return axiosSecure.get(`${favoritesUrl}/game/${gameId}/user/${userId}`)
    .then(res => res.data)
}

const favoriteGame = (id: string) => {
  return axiosSecure.post(`${favoritesUrl}/game/${id}`).then(res => res.data)
}

const unfavoriteGame = (id: string) => {
  return axiosSecure.delete(`${favoritesUrl}/game/${id}`).then(res => res.data)
}

export default {
  getFavoritedBy,
  getUserFavorites,
  getUserFavoritedGame,
  favoriteGame,
  unfavoriteGame
}
