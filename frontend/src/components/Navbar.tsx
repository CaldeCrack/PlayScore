import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import { useBoundStore } from '../stores/boundStore'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'


const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser } = useBoundStore()

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    navigate('/')
  }

  return (
    <AppBar position='sticky' sx={{ width: '100vw', left: 0, top: 0, marginBottom: 1 }} >
      <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} component={Link} to='/'>
          <VideogameAssetIcon />
          <Typography display='inline' variant='h5' sx={{ ml: 1 }}>
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