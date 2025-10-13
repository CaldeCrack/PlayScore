import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import GameInfo from './components/GameInfo'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/games" element={ <Home/> }/>
        <Route path="/games/:id" element={ <GameInfo/> }/>
        <Route path="/login" element={ <Login/> }/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/profile" element={ <Profile/> }/>
      </Routes>
    </Router>
  )
}

export default App
