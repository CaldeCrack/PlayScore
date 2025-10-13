import axios from 'axios'


const commentsUrl = '/api/comments'

const getAllComments = () => {
  return axios.get(commentsUrl).then(response => response.data)
}

const getCommentById = (id: string) => {
  return axios.get(`${commentsUrl}/${id}`).then(response => response.data)
}

const getGameComments = (id: string) => {
  return axios.get(`${commentsUrl}/game/${id}`).then(response => response.data)
}

const getUserComments = (id: string) => {
  return axios.get(`${commentsUrl}/user/${id}`).then(response => response.data)
}

const deleteComment = (id: string) => {
  return axios.delete(`${commentsUrl}/${id}`).then(response => response.data)
}

const postComment = (userId: string, gameId: string, content: string) => {
  const comment = { 'user': userId, 'game': gameId, 'content': content }

  return axios.post(`${commentsUrl}`, comment)
}

export default {
  getAllComments,
  getCommentById,
  getGameComments,
  getUserComments,
  deleteComment,
  postComment
}
