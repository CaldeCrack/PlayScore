import React, { useState } from 'react'
import userService from '../services/users'
import type { PostUser } from '../services/users'
import { Link, useNavigate } from 'react-router-dom'


const SignUp = () => {
  const [PostUser, setPostUser] = useState<PostUser>({
    name: '',
    username: '',
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPostUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!PostUser.name || !PostUser.username || !PostUser.email || !PostUser.password) {
      setError('All fields are required.')
      return
    }

    try {
      setLoading(true)
      await userService.postUser(PostUser)
      setMessage('User created successfully!')
      setPostUser({ name: '', username: '', email: '', password: '' })
      navigate('/login')
    } catch (_exception) {
      setError('Failed to create user')
      setTimeout(() => {
        setError(null)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className='title'>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={PostUser.name}
          onChange={handleChange}
        /><br/>
        <input
          type='text'
          name='username'
          placeholder='Username'
          value={PostUser.username}
          onChange={handleChange}
        /><br/>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={PostUser.email}
          onChange={handleChange}
        /><br/>
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={PostUser.password}
          onChange={handleChange}
        /><br/><br/>

        <button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button><br/>
        <Link to='/login' className='underlined'>Already have an account? Log in</Link>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default SignUp