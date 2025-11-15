import { useEffect, useState } from 'react'
import loginService from '../services/login'
import { Link, useNavigate } from 'react-router-dom'
import { useBoundStore } from '../stores/boundStore'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'


function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { user, setUser } = useBoundStore()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    try {
      setLoading(true)
      const userData = await loginService.login({ username, password })
      setUser(userData)
      setUsername('')
      setPassword('')
      setMessage('Successfully logged in!')
      navigate('/')
    } catch (_exception) {
      setError('Wrong credentials')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user)
      navigate('/')
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        height: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card sx={{ width: 380, p: 2 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
            Login
          </Typography>

          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Log in'
                )}
              </Button>

              <Typography textAlign="center" variant="body2">
                <Link to="/signup">Create an account</Link>
              </Typography>

              {message && <Alert severity="success">{message}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
