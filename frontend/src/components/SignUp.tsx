import React, { useState } from 'react'
import userService from '../services/users'
import type { PostUser } from '../services/users'


const SignUp = () => {
  const [PostUser, setPostUser] = useState<PostUser>({
    name: '',
    username: '',
    email: '',
    password: '',
  })

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.data?.error)
        setError(err.response.data.error)
      else
        setError('Failed to create user.')
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
        /><br/>

        <button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default SignUp