import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import GameInfo from './components/GameInfo'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import AddGame from './components/AddGame'
import { useEffect } from 'react'
import loginService from './services/login'
import { useBoundStore } from './stores/boundStore'
import { createTheme, ThemeProvider } from '@mui/material/styles'


declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary']
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#848ff9',
      dark: '#080a1e',
      contrastText: '#3c4172'
    },
    secondary: {
      main: '#772f66',
    },
    accent: {
      main: '#e59937',
    },
    background: {
      paper: '#020412',
      default: '#020412'
    },
    text: {
      primary: '#e7eafc',
      secondary: '#020412'
    }
  },
})

function App() {
  const { setUser } = useBoundStore()

  useEffect(() => {
    const init = async () => {
      const user = await loginService.restoreLogin()
      setUser(user)
    }
    init()
  }, [])

  return (
    <ThemeProvider theme={customTheme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={ <Home /> }/>
          <Route path="/games" element={ <Home /> }/>
          <Route path="/games/:id" element={ <GameInfo /> }/>
          <Route path="/login" element={ <Login /> }/>
          <Route path="/signup" element={ <SignUp /> }/>
          <Route path="/profile" element={ <Profile /> }/>
          <Route path="/profile/:id" element={ <Profile guest={true} /> }/>
          <Route path="/add-game" element={ <AddGame /> }/>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
