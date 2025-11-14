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
import { Container } from '@mui/material'


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
    <Container>
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
    </Container>
  )
}

export default App
