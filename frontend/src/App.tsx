import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import GameInfo from './components/GameInfo'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import { useEffect, useState } from 'react'
import type User from './types/User'
import loginService from './services/login'


function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const init = async () => {
      const user = await loginService.restoreLogin()
      setUser(user)
    }
    init()
  }, [])

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/games" element={ <Home/> }/>
        <Route path="/games/:id" element={ <GameInfo/> }/>
        <Route path="/login" element={ <Login setUser={setUser} /> }/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/profile" element={ <Profile/> }/>
      </Routes>
    </Router>
  )
}

export default App
