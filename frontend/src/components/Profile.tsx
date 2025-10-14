import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import type User from '../types/User'
import usersService from '../services/users'
import ratingsService from '../services/ratings'
import type Rating from '../types/Rating'


function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [ratings, setRatings] = useState<Rating[] | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const user = await loginService.restoreLogin()
      if (!user)
        navigate('/login')
      const userData = await usersService.getUserById(user.id)
      setUser(userData)
      const ratings = await ratingsService.getUserRatings(userData.id)
      setRatings(ratings)
      setLoading(false)
    }
    init()
  }, [navigate])

  if (loading) return <p>Loading profile...</p>
  if (!user) return null

  return (
    <div>
      <h1 className="title">Profile</h1>

      <div>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div>
        <h2>Ratings</h2>
        {ratings && ratings.length > 0
          ? (
            <ul>
              {ratings.map((rating, i) => (
                <li key={i}>Game: {rating.game.title} - Score: ⭐ {rating.score}</li>
              ))}
            </ul>
          ) : (
            <p>No ratings yet.</p>
          )}
      </div>

      <div>
        <h2>Comments</h2>
        {user.comments.length > 0 ? (
          <ul>
            {user.comments.map((comment, i) => (
              <li key={i}>{comment.content}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  )
}

export default Profile