import React, { useEffect, useState } from 'react'
import userService from '../services/users'
import type { PostUser } from '../services/users'
import { Link, useNavigate } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useBoundStore } from '../stores/boundStore'


const SignUp = () => {
  const [postUser, setPostUser] = useState<PostUser>({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  const navigate = useNavigate()
  const { user, setMessage, setSeverity, toggleOn } = useBoundStore()

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPostUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!postUser.name || !postUser.username || !postUser.email || !postUser.password) {
      setMessage('All fields are required.')
      setSeverity('warning')
      toggleOn()
      return
    }

    try {
      setLoading(true)
      await userService.postUser(postUser)
      setMessage('User created successfully!')
      setPostUser({ name: '', username: '', email: '', password: '' })
      navigate('/login')
    } catch (_exception) {
      setMessage('Failed to create user')
      setSeverity('error')
      toggleOn()
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
        alignItems: 'center',
      }}
    >
      <Card sx={{ width: 380, p: 2 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={2}>
            Sign Up
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                name="name"
                value={postUser.name}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />

              <TextField
                label="Username"
                name="username"
                value={postUser.username}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />

              <TextField
                label="Email"
                type="email"
                name="email"
                value={postUser.email}
                onChange={handleChange}
                fullWidth
                disabled={loading}
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                value={postUser.password}
                onChange={handleChange}
                fullWidth
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
                  'Register'
                )}
              </Button>

              <Typography textAlign="center" variant="body2">
                <Link to="/login">Already have an account? Log in</Link>
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SignUp
