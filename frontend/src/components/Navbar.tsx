import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import { useBoundStore } from '../stores/boundStore'
import { Box, AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material/styles'


const Navbar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { user, setUser } = useBoundStore()

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    navigate('/')
  }

  return (
    <AppBar position='sticky' sx={{ width: '100vw', left: 0, top: 0 }} >
      <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant='h5' component={Link} to='/' color={theme.palette.primary.contrastText}>
            PlayScore
          </Typography>
        </Box>

        <Box>
          <IconButton component={Link} to={user ? '/profile' : '/login'}>
            <PersonIcon fontSize='medium' />
          </IconButton>
          {user && (
            <IconButton onClick={handleLogout}>
              <LogoutIcon fontSize='medium' />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar