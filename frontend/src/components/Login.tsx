import { useEffect, useState } from 'react'
import loginService from '../services/login'
import { Link, useNavigate } from 'react-router-dom'
import type User from '../types/User'


interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

function Login({ setUser }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      const user = await loginService.restoreLogin()
      if (user)
        navigate('/profile')
    }
    init()
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    try {
      setLoading(true)
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('Successfully logged in!')
      navigate('/')
    } catch (_exception) {
      setError('Wrong credentials')
      setTimeout(() => {
        setError(null)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className='title'>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type='text'
          name='username'
          placeholder='Username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        /><br/>
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        /><br/><br/>

        <button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button><br/>
        <Link to='/signup' className='underlined'>Create an account</Link>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default Login