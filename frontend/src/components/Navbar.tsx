import { Link, useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import { useBoundStore } from '../stores/boundStore'
import GameSearch from './GameSearch'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Tooltip from '@mui/material/Tooltip'


const Navbar = () => {
  const navigate = useNavigate()
  const { user, setUser, setMessage, setSeverity, toggleOn } = useBoundStore()

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    setMessage('Succesfully logged out!')
    setSeverity('success')
    toggleOn()
    navigate('/')
  }

  return (
    <AppBar position='sticky' sx={{ width: '100vw', left: 0, top: 0, marginBottom: 1 }} >
      <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }} component={Link} to='/'>
            <VideogameAssetIcon />
            <Typography display='inline' variant='h5' sx={{ ml: 1, mr: 3 }}>
              PlayScore
            </Typography>
          </Box>
          <GameSearch />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {user && user.username === 'admin' && (
            <Tooltip title='Add a Game' arrow>
              <IconButton component={Link} to='/add-game' color='primary'>
                <AddIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          )}
          <Button
            component={Link}
            to={user ? '/profile' : '/login'}
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <PersonIcon fontSize='medium' sx={{ mr: 0.3 }} />
            <Typography display='inline'>{user ? user.username : 'Guest'}</Typography>
          </Button>
          {user && (
            <Tooltip title='Logout' arrow>
              <IconButton onClick={handleLogout} color='primary'>
                <LogoutIcon fontSize='medium' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar